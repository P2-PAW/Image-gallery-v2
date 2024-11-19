import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from "./api/axios";

const Modal = ({ setSelectedImg, selectedImg, onDelete }) => {
  const handleClick = (e) => {
    if (e.target.classList.contains('backdrop')) {
      setSelectedImg(null);
    }
  };

  const handleDelete = async () => {
     try {
       console.error('Error fetching images:', selectedImg);
        await axios.delete('http://localhost:8000/picture/${selectedImg.id}');
         window.location.reload();
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    setSelectedImg(null);
  };

  return (

    <motion.div className="backdrop" onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div className="modal-content"
        initial={{ y: "-100vh" }}
        animate={{ y: 0 }}
      >
        <img src={'http://localhost:8000${selectedImg.path}'}  alt="enlarged pic" />
        <button className="button" onClick={handleDelete}>
                  <FontAwesomeIcon icon={faTrash} />
              </button>
      </motion.div>
    </motion.div>
  );
}

export default Modal;