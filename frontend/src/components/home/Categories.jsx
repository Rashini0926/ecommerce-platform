import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getCategories,
} from "../../services/productService";

function Categories() {
  const navigate =
    useNavigate();

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD CATEGORIES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadCategories =
      async () => {

        try {
          setLoading(true);

          setError("");

          /*
           * Load categories
           * from productService.
           */
          const data =
            await getCategories();

          /*
           * Support:
           *
           * [...]
           *
           * OR
           *
           * {
           *   categories: [...]
           * }
           */
          const categoryList =
            Array.isArray(data)
              ? data
              : data?.categories || [];

          setCategories(
            categoryList
          );

        } catch (err) {

          console.error(
            "Failed to load categories:",
            err
          );

          setCategories([]);

          setError(
            "Unable to load categories."
          );

        } finally {

          setLoading(false);

        }
      };

    loadCategories();

  }, []);

  /*
  |--------------------------------------------------------------------------
  | CATEGORY CLICK
  |--------------------------------------------------------------------------
  */

  const handleCategoryClick =
    (category) => {

      if (!category?.id) {
        return;
      }

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
       * Prevent the category card
       * click from firing.
       */
      event.stopPropagation();

      if (
        !category?.id ||
        !subcategory?.id
      ) {
        return;
      }

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

        <div className="text-center mb-5">

          <h2 className="fw-bold mb-2">
            Shop by Category
          </h2>

          <p className="text-muted">
            Explore our wide range of products
          </p>

        </div>

        <div className="text-center py-4">

          <div
            className="spinner-border text-primary"
            role="status"
            aria-label="Loading categories"
          />

          <p className="text-muted mt-3 mb-0">
            Loading categories...
          </p>

        </div>

      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <section className="container py-5">

        <div className="text-center mb-5">

          <h2 className="fw-bold mb-2">
            Shop by Category
          </h2>

          <p className="text-muted">
            Explore our wide range of products
          </p>

        </div>

        <div
          className="alert alert-danger text-center"
          role="alert"
        >
          {error}
        </div>

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

      {/* ================================================================
          HEADER
      ================================================================ */}

      <div className="text-center mb-5">

        <h2 className="fw-bold mb-2">
          Shop by Category
        </h2>

        <p className="text-muted">
          Explore our wide range of products
        </p>

      </div>


      {/* ================================================================
          EMPTY STATE
      ================================================================ */}

      {categories.length === 0 ? (

        <div className="text-center py-4">

          <p className="text-muted mb-0">
            No categories available.
          </p>

        </div>

      ) : (

        /* ==============================================================
           CATEGORY GRID
        ============================================================== */

        <div className="row g-3">

          {categories.map(
            (category) => {

              const isActive =
                activeCategory ===
                category.id;

              const subcategories =
                Array.isArray(
                  category.subcategories
                )
                  ? category.subcategories
                  : [];

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

                  {/* =====================================================
                      CATEGORY CARD
                  ===================================================== */}

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

                      {category.icon || "🛍️"}

                    </div>


                    {/* CATEGORY NAME */}

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


                  {/* =====================================================
                      SUBCATEGORY DROPDOWN
                  ===================================================== */}

                  {isActive &&
                    subcategories.length > 0 && (

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

                      {subcategories.map(
                        (subcategory) => (

                          <button
                            key={
                              subcategory.id
                            }

                            type="button"

                            onClick={(
                              event
                            ) =>
                              handleSubcategoryClick(
                                event,
                                category,
                                subcategory
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
                              event
                            ) => {

                              event.currentTarget.style.background =
                                "#f5f8ff";

                              event.currentTarget.style.color =
                                "#2563eb";

                              event.currentTarget.style.paddingLeft =
                                "24px";

                            }}

                            onMouseLeave={(
                              event
                            ) => {

                              event.currentTarget.style.background =
                                "transparent";

                              event.currentTarget.style.color =
                                "#374151";

                              event.currentTarget.style.paddingLeft =
                                "20px";

                            }}
                          >

                            {subcategory.name}

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

      )}


      {/* ================================================================
          DROPDOWN ANIMATION
      ================================================================ */}

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