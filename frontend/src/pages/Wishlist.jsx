import WishlistCard from "../components/wishlist/WishlistCard";

function Wishlist() {
  const wishlist = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 12990,
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      id: 2,
      name: "Gaming Mouse",
      price: 5990,
      image: "https://picsum.photos/400/300?random=2",
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 18990,
      image: "https://picsum.photos/400/300?random=3",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="alert alert-info">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="row">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="col-lg-4 col-md-6 mb-4"
            >
              <WishlistCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;