import React from 'react';

const Modal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Règles du Jeu de la Vie</h2>
        <p>
          Le jeu de la vie de Conway est un automate cellulaire inventé par John Horton Conway en 1970. C'est un jeu à zéro joueur, ce qui signifie que son évolution est déterminée par son état initial, sans intervention supplémentaire des joueurs.
        </p>
        <h3>Règles :</h3>
        <ol>
          <li>Une cellule vivante avec moins de 2 voisins vivants meurt (solitude).</li>
          <li>Une cellule vivante avec 2 ou 3 voisins vivants survit.</li>
          <li>Une cellule vivante avec plus de 3 voisins vivants meurt (surpopulation).</li>
          <li>Une cellule morte avec exactement 3 voisins vivants devient vivante (reproduction).</li>
        </ol>
        <p>
            Cliquez sur une cellule pour l'activer et laissez la vie faire le reste
        </p>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default Modal;
