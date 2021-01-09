import React, { useEffect, useRef, useState } from "react";

const PageLoader = () => {
    const [isLoading, setIsLoading] = useState(true);

    const loaderRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            setIsLoading(false);

            document.body.style.overflow = "hidden auto";
        }, 2500);
    }, []);

    return (
        <div className={`main-loader page-loader ${isLoading ? "active" : ""}`} ref={loaderRef}>
            <div className="box">
                <div className="loader-37"></div>
            </div>
        </div>
    );
};

export default PageLoader;
