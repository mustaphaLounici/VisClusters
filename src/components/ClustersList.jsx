import React from "react";

function ClustersList({ clusters }) {
  return (
    <div>
      <ul class="list-group">
        {clusters.map((c, i) => (
          <li class="list-group-item">
            C{i} : {c.map(i => `N${i}, `)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClustersList;
