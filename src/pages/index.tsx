import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Book = {
  id: number;
  title: string;
  author_translator: string;
  publisher: string;
  published_date: string;
  read_date: string;
  summary: string;
  thoughts: string;
  research: string;
  notes: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    title: "",
    author_translator: "",
    publisher: "",
    published_date: "",
    read_date: "",
    summary: "",
    thoughts: "",
    research: "",
    notes: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const { data, error } = await supabase.from("books").select("*");
    if (error) console.error("Error fetching books:", error);
    else setBooks(data || []);
  }

  async function addBook() {
    const { data, error } = await supabase
      .from<Book>("books")
      .insert([newBook]);
    if (error) {
      console.error("Error adding book:", error);
    } else {
      if (data && data.length > 0) {
        // Use the inserted data
        setBooks((prevBooks) => [...prevBooks, data[0]]);
      }

      // Reset form
      setNewBook({
        title: "",
        author_translator: "",
        publisher: "",
        published_date: new Date().toISOString().split("T")[0], // Current date
        read_date: new Date().toISOString().split("T")[0], // Current date
        summary: "",
        thoughts: "",
        research: "",
        notes: "",
      });
    }
  }

  return (
    <>
      <Head>
        <title>読書ログアプリ</title>
        <meta name="description" content="読んだ本の記録を管理するアプリ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>📚 読書ログ</h1>

          {/* 本の追加フォーム */}
          <div>
            <input
              type="text"
              placeholder="タイトル"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="著者名・訳者名"
              value={newBook.author_translator}
              onChange={(e) =>
                setNewBook({ ...newBook, author_translator: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="出版社名"
              value={newBook.publisher}
              onChange={(e) =>
                setNewBook({ ...newBook, publisher: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="発行年月日"
              value={newBook.published_date}
              onChange={(e) =>
                setNewBook({ ...newBook, published_date: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="読んだ日付"
              value={newBook.read_date}
              onChange={(e) =>
                setNewBook({ ...newBook, read_date: e.target.value })
              }
            />
            <textarea
              placeholder="本の要点"
              value={newBook.summary}
              onChange={(e) =>
                setNewBook({ ...newBook, summary: e.target.value })
              }
            />
            <textarea
              placeholder="感想・意見"
              value={newBook.thoughts}
              onChange={(e) =>
                setNewBook({ ...newBook, thoughts: e.target.value })
              }
            />
            <textarea
              placeholder="調べたいこと"
              value={newBook.research}
              onChange={(e) =>
                setNewBook({ ...newBook, research: e.target.value })
              }
            />
            <textarea
              placeholder="備考（きっかけ、気になった言葉など）"
              value={newBook.notes}
              onChange={(e) =>
                setNewBook({ ...newBook, notes: e.target.value })
              }
            />
            <button onClick={addBook}>追加</button>
          </div>

          {/* 本のリスト表示 */}
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <div><strong>タイトル:</strong> {book.title}</div>
                <div><strong>著者名・訳者名:</strong> {book.author_translator}</div>
                <div><strong>出版社名:</strong> {book.publisher}</div>
                <div><strong>発行年月日:</strong> {book.published_date}</div>
                <div><strong>読んだ日付:</strong> {book.read_date}</div>
                <div><strong>本の要点:</strong> {book.summary}</div>
                <div><strong>感想・意見:</strong> {book.thoughts}</div>
                <div><strong>調べたいこと:</strong> {book.research}</div>
                <div><strong>備考:</strong> {book.notes}</div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}