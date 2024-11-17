import {
  SortableContext,
} from "@dnd-kit/sortable";
import React from "react";
import Card from "../Card";
import { useDroppable } from "@dnd-kit/core";
import './styles.css'

const statusLabel = {
  NEW: 'A fazer',
  DOING: 'Fazendo',
  DONE: 'Concluído'
}

const Board = ({ title, cards, openCard }) => {
  const { setNodeRef } = useDroppable({ id: title });
  return (
    <div className="flex flex-col flex-1 mx-3 mt-5 mb-1 bg-dark-sky-base rounded-xl py-3 px-4 overflow-hidden">
      <h1 className="my-3 flex font-semibold text-xl text-white">{statusLabel[title]}</h1>
      <SortableContext
        id={title}
        items={cards}
      >
        <div
          ref={setNodeRef}
          className="flex-1 bg-dark-sky-white shadow-[inset_0_0_1em_rgba(0,0,0,0.3)] rounded p-0 overflow-y-scroll cards-list"
        >
          {cards.map((card) => (
            <Card key={card.id} id={card.id} card={card} openCard={openCard} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Board;
