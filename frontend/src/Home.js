"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from './api/axios';

const Home = () => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    const [images, setImages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [showAddImageForm, setShowAddImageForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        path: null,
    });

    const formRef = useRef(null);

    const getImages = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/pictures/`);
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useEffect(() => {
        getImages();
    }, []);

    const onChange = (e) => {
        if (e.target.name === "path") {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/picture/`, formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Image uploaded successfully:', response.data);
            setShowAddImageForm(false);
            setFormData({ name: "", path: null });
            getImages();
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleOutsideClick = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            setShowAddImageForm(false);
        }
    };

    useEffect(() => {
        if (showAddImageForm) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [showAddImageForm]);

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-brand">IMAGEGALLERY</div>
                <div className="navbar-buttons">
                    {token && user ? (
                        <React.Fragment>
                            <button
                                className="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAddImageForm((prevState) => !prevState);
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <div className="dropdown">
                                <button className="button">
                                    <FontAwesomeIcon icon={faUser} />
                                </button>
                                <div className="dropdown-content">
                                    <a href="/user-details">User Details</a>
                                    <a href="/logout">Logout</a>
                                </div>
                            </div>
                        </React.Fragment>
                    ) : (
                        <button className="button">
                            <a href="/login" className="button">Login</a>
                        </button>
                    )}
                </div>
            </nav>
            <div className="main-content">
                <div className="image-grid">
                    {images.map(image => (
                        <div className="image-item" key={image.id} onClick={() => setSelectedImg(image)}>
                            <img src={`http://localhost:8000${image.path}`} alt={image.name} />
                        </div>
                    ))}
                </div>
                {showAddImageForm && (
                    <div className="add-image-form" ref={formRef}>
                        <h2>Add New Image</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="imageName">Image Name</label>
                            <input
                                type="text"
                                id="imageName"
                                autoComplete="off"
                                value={formData.name}
                                name="name"
                                required
                                onChange={onChange}
                            />
                            <label htmlFor="image">Select Image</label>
                            <input
                                type="file"
                                id="image"
                                name="path"
                                accept="image/*"
                                required
                                onChange={onChange}
                            />
                            <button type="submit">Add Image</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;