import React from "react";
import { useLocation } from "react-router";

const VisualizerId = () => {
    const location = useLocation();
    const { initialImage, name } = location.state || {};
    const imageBlock = initialImage ? (
        <div>
            <h2>Source Image</h2>
            <img src={initialImage} alt="Source" />
        </div>
    ) : null;

    return (
        <section>
            <h1>{name || 'Untitled Project'}</h1>
            <div className="visualizer">
                {imageBlock}
            </div>
        </section>
    );
};

export default VisualizerId;
