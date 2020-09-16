import React, { ChangeEventHandler } from "react";
import { SortOrder } from "./AppList";

interface ToggleSortProps {
  order: SortOrder;
  onSort: (order: SortOrder) => void;
}

const ToggleSort: React.FC<ToggleSortProps> = (props) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) =>
    props.onSort(evt.target.value as SortOrder);

  return (
    <div className="apps-sorting-toggler">
      <div>
        <label htmlFor="sort-descending">Newer First</label>
        <input
          id="sort-descending"
          type="radio"
          name="order"
          value={SortOrder.DSC}
          checked={props.order === SortOrder.DSC}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="sort-ascending">Older First</label>
        <input
          id="sort-ascending"
          type="radio"
          name="order"
          value={SortOrder.ASC}
          checked={props.order === SortOrder.ASC}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ToggleSort;
