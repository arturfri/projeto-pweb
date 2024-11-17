import React, { useState } from "react";
import "./styles.css";
import { FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuPenSquare } from "react-icons/lu";
import Modal from "../Modal/Modal";

const priorities = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

const status = {
  NEW: "A fazer",
  DOING: "Fazendo",
  DONE: "Finalizada",
};

const InfoCard = ({  closeModal, card, openEditModal, handleDeleteCard }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <>
      <div className="bg-dark-sky-base w-2/5 h-3/4 rounded-xl flex flex-col items-center p-4">
        <div className=" h-10 flex w-full items-center justify-between">
          <h1 className="text-3xl text-dark-sky-white font-bold">{card.title}</h1>
          <button onClick={closeModal}>
            <FaTimes className="mx-2 text-xl text-dark-sky-white" />
          </button>
        </div>

        <div className="flex justify-around w-full py-3">
          <div className="bg-gray-100 rounded-2xl w-60 h-10 flex items-center justify-center mx-1">
            <p className="text-dark-sky-dark font-semibold pl-2 text-center">
              {priorities[card.priority]}
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl w-60 h-10 flex items-center justify-center mx-1">
            <p className="text-dark-sky-dark text-center font-semibold">
              {status[card.status]}
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl w-60 h-10 flex items-center justify-center mx-1">
            <p className="text-center font-semibold text-dark-sky-dark">
              {card.date}
            </p>
          </div>
        </div>
        <div className="flex-1 w-full bg-white/70 rounded-lg border text-dark-sky-dark border-dark-sky-light text-lg pt-2 pl-2">
          <p>{card.description}</p>
        </div>
        <div className="w-full py-4 ">
          <h1 className="text-2xl font-semibold text-dark-sky-white">Responsáveis</h1>
          <div className="flex py-2">
            {card.owners.map((o) => (
              <div className="bg-dark-sky-light rounded-2xl w-36 h-9 flex items-center justify-center mx-1">
                <p className="text-sm font-bold text-white">{o}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end w-full mt-2 py-1">
          <button
            onClick={() => setDeleteModal(true)}
            className="bg-dark-sky-light/80 hover:bg-dark-sky-light active:bg-dark-sky-light rounded-2xl w-36 h-9 flex items-center justify-center mx-1"
          >
            <FaRegTrashCan className="mr-2 text-white" />
            <p className="text-sm font-bold text-white">Excluir</p>
          </button>
          <button
            onClick={openEditModal}
            className="bg-dark-sky-medium/60 hover:bg-dark-sky-medium/80 active:bg-dark-sky-medium/80 rounded-2xl w-36 h-9 flex items-center justify-center mx-1"
          >
            <LuPenSquare className="mr-2 text-white" />

            <p className="text-sm font-bold text-white">Editar</p>
          </button>
        </div>
      </div>
      <Modal visible={deleteModal}>
        <div className="bg-sky-300 p-3 rounded-xl">
          <h1 className="text-xl font-bold text-slate-700">Excluir</h1>
          <p className="my-2 text-lg text-slate-700">
            Deseja confirmar exclusão?
          </p>
          <div className="flex items-center justify-around mt-2">
            <button
              onClick={() => setDeleteModal(false)}
              className="bg-slate-400 hover:bg-slate-500 active:bg-slate-500 rounded-2xl w-36 h-9 flex items-center justify-center mx-1"
            >
              <p className="text-sm font-bold text-white">Cancelar</p>
            </button>
            <button
              onClick={handleDeleteCard}
              className="bg-red-400 hover:bg-red-500 active:bg-red-500 rounded-2xl w-36 h-9 flex items-center justify-center mx-1"
            >
              <p className="text-sm font-bold text-white">Excluir</p>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InfoCard;
