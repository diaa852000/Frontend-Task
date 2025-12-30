import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import useLibraryData from "../hooks/useLibraryData";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import Modal from "../components/shared/Modal";

const Inventory = () => {
  const { id: storeId } = useParams();
  const { request } = useApi();
  const { isAuthenticated } = useAuth();

  const { storeBooks, books, inventory, setInventory, authorMap, isLoading } =
    useLibraryData({ storeId });

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const [editingId, setEditingId] = useState(null);
  const [priceValue, setPriceValue] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newBookId, setNewBookId] = useState("");
  const [newPrice, setNewPrice] = useState("");

  /* ---------------- SORT + SEARCH ---------------- */

  const filteredBooks = useMemo(() => {
    let data = [...storeBooks];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((b) =>
        `${b.name} ${authorMap[b.author_id]?.name}`.toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [storeBooks, search, sortKey, sortDir, authorMap]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ---------------- ACTIONS ---------------- */

  const savePrice = async (bookId) => {
    const item = inventory.find(
      (i) => i.book_id === bookId && i.store_id === Number(storeId)
    );

    console.log("item", item);

    const updated = await request(`/inventory/${item?.id}`, {
      method: "PATCH",
      body: JSON.stringify({ price: Number(priceValue) }),
    });

    setInventory((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );

    setEditingId(null);
  };

  const deleteBook = async (bookId) => {
    const item = inventory.find(
      (i) => i.book_id === bookId && i.store_id === Number(storeId)
    );

    await request(`/inventory/${item.id}`, { method: "DELETE" });
    setInventory((prev) => prev.filter((i) => i.id !== item.id));
  };

  const addBook = async () => {
    const created = await request("/inventory", {
      method: "POST",
      body: JSON.stringify({
        book_id: Number(newBookId),
        store_id: Number(storeId),
        price: Number(newPrice),
      }),
    });

    setInventory((prev) => [...prev, created]);
    setShowModal(false);
    setNewBookId("");
    setNewPrice("");
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="py-6">
      {/* <Header
        title="Store Inventory"
        buttonTitle="Add to inventory"
        addNew={() => setShowModal(true)}
      /> */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-xl">Store Inventory</h1>
          <input
            className={`border p-2  w-[240px] bg-gray-50 border-gray-300`}
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => setShowModal(true)} disabled={!isAuthenticated} className="disabled:bg-gray-400 bg-blue-500 text-white p-2 rounded disabled:cursor-not-allowed">
          Add to inventory
        </button>
      </div>

      {filteredBooks.length === 0 ? (
        <p>No books found in this store.</p>
      ) : (
        <table className="w-full border border-gray-100 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => toggleSort("id")}>Book Id</th>
              <th onClick={() => toggleSort("name")}>Name</th>
              <th onClick={() => toggleSort("page_count")}>Pages</th>
              <th onClick={() => toggleSort("author")}>Author</th>
              <th onClick={() => toggleSort("price")}>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} className="border-b">
                <td>{book.id}</td>
                <td>{book.name}</td>
                <td>{book.page_count}</td>
                <td>{authorMap[book.author_id]}</td>

                <td>
                  {editingId === book.id ? (
                    <input
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      className="border p-1 w-20"
                    />
                  ) : inventory[book.id]?.price ? (
                    `$${inventory[book.id]?.price}`
                  ) : (
                    ""
                  )}
                </td>

                <td className="flex gap-2 py-1">
                  {editingId === book.id ? (
                    <button
                      className="w-[80px] p-1 bg-green-500 text-white text-sm"
                      onClick={() => savePrice(book.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(book.id);
                        setPriceValue(book.price);
                      }}
                      className="bg-blue-500 text-white text-sm p-1 w-[80px]"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    className="p-1 bg-red-500 text-white text-sm w-[80px]"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ADD BOOK MODAL */}
      <Modal
        title="Add Book to Store"
        show={showModal}
        setShow={setShowModal}
        save={addBook}
        cancel={() => setShowModal(false)}
      >
        <select
          className="border p-2 w-full mb-3"
          value={newBookId}
          onChange={(e) => setNewBookId(e.target.value)}
        >
          <option value="">Select book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Inventory;
