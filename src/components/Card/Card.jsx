import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { BsCalendar2 } from "react-icons/bs";
import { CiCircleInfo } from "react-icons/ci";

const priorities = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

const prioritiesColors = {
  LOW: "bg-yellow-200",
  MEDIUM: "bg-orange-200",
  HIGH: "bg-red-200",
};

const Card = ({ id, card, openCard }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white m-5 hover:shadow-dark-sky-light  border-dark-sky-white shadow-lg p-2 rounded"
    >
      <div className="flex items-center justify-between pr-1">
        <h1 className="text-lg font-bold">{card.title}</h1>
        <button
          className="bg-dark-sky-light/40 rounded-2xl hover:bg-dark-sky-light/60 active:bg-dark-sky-light w-9 h-9 flex items-center justify-center"
          onClick={() => {
            openCard(card);
          }}
        >
          <CiCircleInfo className="text-2xl" />
        </button>
      </div>
      <h2>{card.description}</h2>
      <div className="flex w-full justify-between pt-2">
        <div className="flex items-center">
          <BsCalendar2 className="mr-2" />
          <p>{card.date}</p>
        </div>
        <div
          className={`rounded-3xl w-20 py-1 text-sm font-semibold flex items-centes justify-center ${
            prioritiesColors[card.priority]
          } `}
        >
          <p>{priorities[card.priority]}</p>
        </div>
        <div>
          {card.owners?.map((o) => (
            <p>{o}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
