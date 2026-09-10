<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/productService';
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> Stashed changes

function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | FETCH CATEGORIES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
<<<<<<< Updated upstream
    getCategories()
=======
    fetch(
      "http://127.0.0.1:8000/api/categories"
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to load categories."
          );
        }

        return res.json();
      })

>>>>>>> Stashed changes
      .then((data) => {
        setCategories(data);

        setLoading(false);
      })

      .catch((err) => {
        console.error(
          "Failed to load categories:",
          err
        );

        setLoading(false);
      });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CATEGORY CLICK
  |--------------------------------------------------------------------------
  */

  const handleCategoryClick =
    (category) => {
      navigate(
        `/products?category_id=${category.id}`
      );
    };

  /*
  |--------------------------------------------------------------------------
  | SUBCATEGORY CLICK
  |--------------------------------------------------------------------------
  */

  const handleSubcategoryClick =
    (
      event,
      category,
      subcategory
    ) => {
      /*
       * Stop category card
       * click from also running.
       */
      event.stopPropagation();

      navigate(
        `/products?category_id=${category.id}&subcategory_id=${subcategory.id}`
      );
    };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section className="container py-5">
        <h2 className="text-center mb-4">
          Shop by Category
        </h2>

        <p className="text-center text-muted">
          Loading categories...
        </p>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <section className="container py-5">

      {/* HEADER */}

      <div className="text-center mb-5">

        <h2 className="fw-bold mb-2">
          Shop by Category
        </h2>

        <p className="text-muted">
          Explore our wide range of products
        </p>

      </div>


      {/* CATEGORY GRID */}

      <div className="row g-3">

        {categories.map(
          (category) => {

            const isActive =
              activeCategory ===
              category.id;

            return (

              <div
                className="col-6 col-md-4 col-lg-2"

                key={
                  category.id
                }

                onMouseEnter={() =>
                  setActiveCategory(
                    category.id
                  )
                }

                onMouseLeave={() =>
                  setActiveCategory(
                    null
                  )
                }

                style={{
                  position:
                    "relative",

                  zIndex:
                    isActive
                      ? 50
                      : 1,
                }}
              >

                {/* =======================================================
                    CATEGORY CARD
                ======================================================= */}

                <button
                  type="button"

                  onClick={() =>
                    handleCategoryClick(
                      category
                    )
                  }

                  className="text-center h-100 w-100"

                  style={{
                    cursor:
                      "pointer",

                    padding:
                      "28px 12px",

                    borderRadius:
                      "16px",

                    background:
                      isActive
                        ? "#f5f8ff"
                        : "#ffffff",

                    border:
                      `1px solid ${
                        isActive
                          ? "#2563eb"
                          : "#eef0f3"
                      }`,

                    transition:
                      "all 0.25s ease",

                    transform:
                      isActive
                        ? "translateY(-6px)"
                        : "none",

                    boxShadow:
                      isActive
                        ? "0 16px 28px rgba(37, 99, 235, 0.12)"
                        : "0 2px 6px rgba(0,0,0,0.03)",

                    appearance:
                      "none",

                    outline:
                      "none",
                  }}
                >

                  {/* ICON */}

                  <div
                    style={{
                      width:
                        "64px",

                      height:
                        "64px",

                      margin:
                        "0 auto 14px",

                      borderRadius:
                        "50%",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontSize:
                        "28px",

                      background:
                        isActive
                          ? "#2563eb"
                          : "#f7f8fa",

                      transition:
                        "all 0.25s ease",
                    }}
                  >

                    {category.icon}

                  </div>


                  {/* NAME */}

                  <h6
                    className="mb-0"

                    style={{
                      fontWeight:
                        600,

                      color:
                        isActive
                          ? "#2563eb"
                          : "#1f2430",

                      transition:
                        "color 0.2s ease",
                    }}
                  >

                    {category.name}

                  </h6>

                </button>


                {/* =======================================================
                    SUBCATEGORY DROPDOWN
                ======================================================= */}

                {isActive &&
                  category
                    .subcategories
                    ?.length >
                    0 && (

                    <div
                      style={{
                        position:
                          "absolute",

                        top:
                          "calc(100% + 6px)",

                        left:
                          "50%",

                        transform:
                          "translateX(-50%)",

                        minWidth:
                          "200px",

                        background:
                          "#ffffff",

                        border:
                          "1px solid #eef0f3",

                        borderRadius:
                          "12px",

                        padding:
                          "10px 0",

                        boxShadow:
                          "0 16px 32px rgba(0,0,0,0.08)",

                        zIndex:
                          1000,

                        pointerEvents:
                          "auto",

                        animation:
                          "catFadeIn 0.18s ease",
                      }}
                    >

                      {category.subcategories.map(
                        (sub) => (

                          <button
                            key={
                              sub.id
                            }

                            type="button"

                            onClick={(
                              event
                            ) =>
                              handleSubcategoryClick(
                                event,
                                category,
                                sub
                              )
                            }

                            style={{
                              display:
                                "block",

                              width:
                                "100%",

                              padding:
                                "10px 20px",

                              fontSize:
                                "13.5px",

                              color:
                                "#374151",

                              cursor:
                                "pointer",

                              transition:
                                "all 0.15s ease",

                              textAlign:
                                "left",

                              background:
                                "transparent",

                              border:
                                "none",

                              outline:
                                "none",
                            }}

                            onMouseEnter={(
                              e
                            ) => {

                              e.currentTarget.style.background =
                                "#f5f8ff";

                              e.currentTarget.style.color =
                                "#2563eb";

                              e.currentTarget.style.paddingLeft =
                                "24px";

                            }}

                            onMouseLeave={(
                              e
                            ) => {

                              e.currentTarget.style.background =
                                "transparent";

                              e.currentTarget.style.color =
                                "#374151";

                              e.currentTarget.style.paddingLeft =
                                "20px";

                            }}
                          >

                            {sub.name}

                          </button>

                        )
                      )}

                    </div>
                  )}

              </div>

            );
          }
        )}

      </div>


      {/* ANIMATION */}

      <style>
        {`
          @keyframes catFadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -6px);
            }

            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
        `}
      </style>

    </section>
  );
}

export default Categories;