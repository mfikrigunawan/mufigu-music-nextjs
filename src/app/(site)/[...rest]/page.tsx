import { notFound } from 'next/navigation';

// Ada dua root layout (situs dan CMS), jadi URL tak dikenal diarahkan ke 404 milik situs lewat sini.
export default function CatchAll() {
  notFound();
}
