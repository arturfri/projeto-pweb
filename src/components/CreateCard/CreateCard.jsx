import classNames from "classnames";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import "./styles.css";
import { FiPlusCircle } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";

const CreateCard = forwardRef(
  ({  handleBackButton, card, submitCard }, ref) => {
    const [title, setTitle] = useState(card?.title || "");
    const [description, setDescription] = useState(card?.description || "");
    const [date, setDate] = useState(() => {
      if (card?.date) {
        return card?.date.split("/").reverse().join("-");
      }
      return "";
    });
    const [priority, setPriority] = useState(card?.priority || "");
    const [status, setStatus] = useState(card?.status || "NEW");
    const [owners, setOwners] = useState(card?.owners || []);

    const [ownerEditing, setOwnerEditing] = useState(false);
    const [owner, setOwner] = useState("");

    useImperativeHandle(ref, () => {
      return {
        getCardData() {
          const newCard = {
            title,
            description,
            owners,
            status,
            priority,
            date: date.split('-').reverse().join('/'),
          };
          if(card?.id){
            newCard.id = card.id;
          }
          return newCard;
        },
      };
    });

    return (
        <div className="bg-dark-sky-base w-2/5 h-3/4 rounded-xl flex flex-col items-center p-4 border border-dark-sky-medium">
          <input
            value={title}
            className="bg-gray-100 outline-none w-full h-10 rounded-lg pl-2 text-xl text-dark-sky-dark border-dark-sky-light border shadow-sm hover:shadow-dark-sky-light focus:shadow-dark-sky-light"
            placeholder="Preencha o título aqui..."
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-around w-full py-3">
            <div className="bg-gray-100 rounded-2xl w-60 h-10 flex items-center justify-center mx-1">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-full rounded-2xl bg-gray-100 text-dark-sky-dark font-semibold pl-2 text-center outline-none focus:outline-none "
              >
                <option value="" className="font-semibold">
                  Prioridade
                </option>
                <option className="text-yellow-400 font-semibold" value="LOW">
                  Baixa
                </option>
                <option
                  className="text-orange-400 font-semibold"
                  value="MEDIUM"
                >
                  Média
                </option>
                <option className="text-red-400 font-semibold" value="HIGH">
                  Alta
                </option>
              </select>
            </div>
            <div className="bg-gray-100 rounded-2xl w-60 h-10 flex items-center justify-center mx-1">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-full rounded-2xl bg-gray-100 text-dark-sky-dark font-semibold pl-2 text-center outline-none focus:outline-none "
              >
                <option value="" className="font-semibold">
                  Status
                </option>
                <option className="font-semibold" value="NEW">
                  A fazer
                </option>
                <option className="font-semibold" value="DOING">
                  Fazendo
                </option>
                <option className="font-semibold" value="DONE">
                  Finalizado
                </option>
              </select>
            </div>
            <div className="bg-gray-100 rounded-2xl w-60 h-10 flex items-center justify-center mx-1">
              <input
                type="date"
                className="w-full h-full rounded-2xl px-3 text-dark-sky-dark "
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex-1 w-full ">
            <textarea
              className="resize-none rounded-lg w-full h-full pt-2 pl-2 text-lg outline-none text-dark-sky-dark border-dark-sky-light border shadow-sm hover:shadow-dark-sky-light focus:shadow-dark-sky-light"
              placeholder="Insira a descrição aqui..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="w-full py-4 ">
            <h1 className="text-2xl font-semibold text-dark-sky-white">Responsáveis</h1>
            <div className="flex py-2">
              <div className="bg-dark-sky-medium/50 cursor-pointer hover:bg-dark-sky-medium/60 rounded-2xl w-36 h-9 flex items-center justify-start mx-1 text-center px-2">
                <button
                  className={classNames("mr-2", { "rotate-45": ownerEditing })}
                  onClick={() => setOwnerEditing((prevOE) => !prevOE)}
                >
                  <FiPlusCircle
                    className={classNames("text-xl text-white", {
                      "text-red-500": ownerEditing,
                    })}
                  />
                </button>
                {!ownerEditing ? (
                  <p className="text-sm font-bold text-white">Novo</p>
                ) : (
                  <input
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-transparent text-sm border-white text-white border-b focus:outline-none"
                  />
                )}
                {ownerEditing && (
                  <button
                    className="mr-2"
                    onClick={() => {
                      if (owner !== "") {
                        setOwners((prevOwners) => [...prevOwners, owner]);
                        setOwnerEditing(false);
                        setOwner("");
                      }
                    }}
                  >
                    <FaCheck className="ml-2 text-lg text-white" />
                  </button>
                )}
              </div>
              {owners.map((o) => (
                <div className="bg-dark-sky-light  rounded-2xl w-36 h-9 flex items-center justify-center mx-1">
                  <p className="text-sm font-bold text-dark-sky-white">{o}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end w-full mt-2 py-1">
            <button
              onClick={handleBackButton}
              className="bg-dark-sky-light/80 hover:bg-dark-sky-light active:bg-dark-sky-light rounded-2xl w-36 h-9 flex items-center justify-center mx-1"
            >
              <p className="text-sm font-bold text-white">Cancelar</p>
            </button>
            <button
              onClick={submitCard}
              className="bg-dark-sky-medium/60 hover:bg-dark-sky-medium/80 active:bg-dark-sky-medium/80 rounded-2xl w-36 h-9 flex items-center justify-center mx-1"
            >
              <p className="text-sm font-bold text-white">{card ? 'Editar' : 'Criar'}</p>
            </button>
          </div>
        </div>
    );
  }
);

export default CreateCard;
