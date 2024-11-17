import { DndContext, useSensor, useSensors } from "@dnd-kit/core";
import React, { useEffect, useRef, useState } from "react";
import Board from "../../components/Board";
import { arrayMove } from "@dnd-kit/sortable";
import Modal from "../../components/Modal";
import CreateCard from "../../components/CreateCard";
import InfoCard from "../../components/InfoCard";
import {
  getStoreData,
  initDB,
  storeName,
  addData,
  updateData,
  deleteData,
} from "../../services/db";
import { MouseSensor, TouchSensor } from "../../config/dndsensors";

const CREATE_MODAL = "CREATE";
const INFO_MODAL = "INFO";

const Home = () => {
  const [cardsList, setCardsList] = useState({
    NEW: [],
    DOING: [],
    DONE: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const createCardRef = useRef(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const dragEndHandler = (e) => {
    if (e.active.id === e.over?.id) return;

    if (
      e.active.data.current?.sortable.containerId !==
      e.over?.data.current?.sortable.containerId
    )
      return;

    const containerName = e.active.data.current?.sortable.containerId;

    setCardsList((prevCardsList) => {
      const temp = { ...prevCardsList };
      const oldIdx = temp[containerName].findIndex((c) => c.id === e.active.id);
      const newIdx = temp[containerName].findIndex((c) => c.id === e.over.id);
      temp[containerName] = arrayMove(temp[containerName], oldIdx, newIdx);
      return temp;
    });
  };

  const dragOverHandler = (e) => {
    if (!e.over) return;

    const initialContainer = e.active.data.current?.sortable?.containerId;
    const targetContainer = e.over.data.current?.sortable?.containerId;

    if (!initialContainer) return;

    setCardsList((prevCardsList) => {
      const temp = { ...prevCardsList };

      if (!targetContainer) {
        if (!!prevCardsList[e.over.id].find((t) => t.id === e.active.id)) {
          return temp;
        }
        const item = temp[initialContainer].find((c) => c.id === e.active.id);
        temp[initialContainer] = temp[initialContainer].filter(
          (card) => card.id.toString() !== e.active.id.toString()
        );
        item.status = e.over.id;
        temp[e.over.id].push(item);

        return temp;
      }

      if (initialContainer === targetContainer) {
        const oldIdx = temp[initialContainer].findIndex(
          (c) => c.id === e.active.id
        );
        const newIdx = temp[initialContainer].findIndex(
          (c) => c.id === e.over.id
        );
        console.log({ oldIdx, newIdx });
        temp[initialContainer] = arrayMove(
          temp[initialContainer],
          oldIdx,
          newIdx
        );
      } else {
        const item = temp[initialContainer].find((c) => c.id === e.active.id);
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task.id !== e.active.id
        );

        const newIdx = temp[targetContainer].findIndex(
          (c) => c.id === e.over.id
        );
        temp[targetContainer] = temp[targetContainer].filter(
          (c) => c.id !== item.id
        );
        temp[targetContainer].splice(newIdx, 0, item);
      }
      return temp;
    });
  };

  const getCardsAsync = async () => {
    try {
      const result = await getStoreData(storeName);
      if (result.success) {
        const cards = {
          NEW: [],
          DOING: [],
          DONE: [],
        };
        result.data.forEach((card) => {
          cards[card.status].push(card);
        });
        setCardsList(cards);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const initializeDB = async () => {
    try {
      const result = await initDB();
      console.log({ result });
      if (result) {
        getCardsAsync();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    initializeDB();
  }, []);

  const handleSubmitCard = async () => {
    const card = createCardRef.current?.getCardData();
    
    try {
      const result = !!selectedCard
        ? await updateData(storeName, card)
        : await addData(storeName, card);
      console.log({ result });
      if (result.success) {
        closeModal();
        getCardsAsync();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDeleteCard = async () => {
    try {
      const result = await deleteData(storeName, selectedCard.id);
      if (result.success) {
        closeModal();
        getCardsAsync();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const openModal = (type, card) => {
    setModalType(type);
    if (type === INFO_MODAL) {
      setSelectedCard(card);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
    setModalType(null);
  };

  return (
    <div className="py-3 px-5 flex flex-col h-screen bg-gradient-to-t from-dark-sky-medium to-dark-sky-dark overflow-hidden ">
      <div className="flex mt-3 ml-4 mb-3 items-center">
        <h1 className="text-[32px] font-semibold text-dark-sky-white">
          To the stars 💫
        </h1>
        <button
          onClick={() => openModal(CREATE_MODAL)}
          className="rounded-lg bg-dark-sky-light/40 hover:bg-dark-sky-light/60 text-dark-sky-white  flex items-center justify-center px-4 mx-4 h-10"
        >
          Criar tarefa
        </button>
      </div>
      <div className="h-40 min-h-38 border bg-dark-sky-light/40 border-slate-500 mx-2 rounded"></div>
      <div className="w-full h-[70vh] flex">
        <DndContext
          onDragEnd={dragEndHandler}
          onDragOver={dragOverHandler}
          sensors={sensors}
        >
          <main className="flex-1 max-h-[80vh] flex">
            <section className="flex flex-1 ">
              {Object.keys(cardsList).map((board) => (
                <Board
                  key={board}
                  title={board}
                  cards={cardsList[board]}
                  openCard={(card) => openModal(INFO_MODAL, card)}
                />
              ))}
            </section>
          </main>
        </DndContext>
      </div>
      <Modal visible={modalOpen}>
        {modalType === CREATE_MODAL && (
          <CreateCard
            ref={createCardRef}
            visible={modalOpen}
            submitCard={handleSubmitCard}
            handleBackButton={() =>
              !!selectedCard ? setModalType(INFO_MODAL) : closeModal()
            }
            card={selectedCard}
          />
        )}
        {modalType === INFO_MODAL && (
          <InfoCard
            visible={modalOpen}
            openEditModal={() => setModalType(CREATE_MODAL)}
            handleDeleteCard={handleDeleteCard}
            closeModal={closeModal}
            card={selectedCard}
          />
        )}
      </Modal>
    </div>
  );
};

export default Home;
