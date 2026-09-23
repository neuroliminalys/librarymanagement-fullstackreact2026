import { useCallback, useEffect, useState } from "react";

import type { Book } from "./book";
import { bookService } from "./book-service";

export function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      const loadedBooks = await bookService.getBooks();
      setBooks(loadedBooks);
    } catch (error) {
      console.error("Erreur lors du chargement des livres", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  async function borrowBook(id: number) {
    try {
      await bookService.borrowBook(id);
      await loadBooks();
    } catch (error) {
      console.error("Erreur lors de l’emprunt du livre", error);
    }
  }

  async function returnBook(id: number) {
    try {
      await bookService.returnBook(id);
      await loadBooks();
    } catch (error) {
      console.error("Erreur lors du retour du livre", error);
    }
  }

  async function deleteBook(id: number) {
    try {
      await bookService.deleteBook(id);
      await loadBooks();
    } catch (error) {
      console.error("Erreur lors de la suppression du livre", error);
    }
  }

  return (
    <>
      <h2>Book List</h2>

      {loading ? (
        <div>Loading...</div>
      ) : books.length ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Available Copies</th>
              <th>Total Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                className="book-item"
                data-cy={`book-${book.id}`}
                key={book.id ?? `${book.title}-${book.author}`}
              >
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td data-cy={`book-${book.id}-available-copies`}>
                  {book.available_copies}
                </td>
                <td data-cy={`book-${book.id}-total-copies`}>{book.total_copies}</td>
                <td>
                  {book.id !== undefined && (
                    <>
                      <button
                        data-cy={`borrow-${book.id}`}
                        type="button"
                        onClick={() => void borrowBook(book.id!)}
                      >
                        Borrow
                      </button>
                      <button
                        data-cy={`return-${book.id}`}
                        type="button"
                        onClick={() => void returnBook(book.id!)}
                      >
                        Return
                      </button>
                      <button
                        data-cy={`delete-${book.id}`}
                        type="button"
                        onClick={() => void deleteBook(book.id!)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Please add a new book to the library</div>
      )}
    </>
  );
}
