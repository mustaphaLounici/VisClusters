import React, { useRef } from "react";

function Options({ data, algo, onSubmit }) {
  const algoRef = useRef(null);
  const dataRef = useRef(null);
  return (
    <div className="container">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(algoRef.current.value, dataRef.current.value);
        }}
      >
        <div class="form-group">
          <label>Algo :</label>
          <select defaultValue={algo} ref={algoRef} className="form-control">
            <option value="0">Label Propagation</option>
            <option value="1">Louvain</option>
          </select>
        </div>
        <div class="form-group">
          <label>matrice D'adjacence:</label>
          <textarea
            ref={dataRef}
            className="form-control"
            rows="7"
            defaultValue={data}
          />
        </div>
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-primary">
            Afficher
          </button>
        </div>
      </form>
    </div>
  );
}

export default Options;
