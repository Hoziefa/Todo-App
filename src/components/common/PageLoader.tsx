import React, { useEffect, useState } from 'react';

const PageLoader: React.FC = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        document.body.style.overflow = 'hidden';

        setTimeout((): void => {
            setIsLoading(false);

            document.body.removeAttribute('style');
        }, 2500);
    }, []);

    return (
        <div className={ `main-loader page-loader ${ isLoading ? 'active' : '' }` }>
            <section>
                <div className="loader loader-2">
                    <svg className="loader-star" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <polygon points="29.8 0.3 22.8 21.8 0 21.8 18.5 35.2 11.5 56.7 29.8 43.4 48.2 56.7 41.2 35.1 59.6 21.8 36.8 21.8 " fill="#18ffff" />
                    </svg>

                    <div className="loader-circles" />
                </div>
            </section>
        </div>
    );
};

export default PageLoader;
