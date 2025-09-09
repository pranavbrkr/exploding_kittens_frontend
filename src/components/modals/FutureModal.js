import BaseModal from "./BaseModal";

function FutureModal({ show, futureCards, onClose }) {
  return (
    <BaseModal 
      show={show} 
      onClose={onClose}
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        minWidth: 600
      }}
    >
      {futureCards.map((card, index) => (
        <img
          key={index}
          src={`/assets/cards/${card.toLowerCase().replace(/\s+/g, '_')}.jpg`}
          alt={card}
          width={200}
          style={{
            borderRadius: 12,
            boxShadow: '0 0 15px rgba(0,0,0,0.3)'
          }}
        />
      ))}
    </BaseModal>
  );
}

export default FutureModal;
