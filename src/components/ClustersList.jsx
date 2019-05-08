import React from "react";

function ClustersList({ clusters }) {
  return (
    <div>
      <ul class="list-group">
        <li class="list-group-item h3">Liste des Clusters</li>
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
