import React, {useState, useEffect} from 'react'
import Header from './components/Header'
import Search from './components/Search'
import BooksContainer from './components/BooksContainer'
import DetailPanel from './components/DetailPanel'
import {GlobalStyle} from './styles'
import {Transition} from 'react-transition-group'

const BOOKS = [
  { title: "Just Mercy", author: "Bryan Stevenson", published: 2014 },
  { title: "The Fifth Season", author: "N. K. Jemisin", published: 2015 },
  { title: "So You Want to Talk About Race", author: "Ijeoma Oluo", published: 2018 },
  { title: "If Beale Street Could Talk", author: "James Baldwin", published: 1974 },
  { title: "Are Prisons Obsolete?", author: "Angela Y. Davis", published: 2003 },
  { title: "Parable of the Sower", author: "Octavia E. Butler", published: 1993 },
  { title: "The Water Dancer", author: "Ta-Nehisi Coates", published: 2019 },
  { title: "The Autobiography of Malcolm X", author: "Malcolm X and Alex Haley", published: 1965 },
  { title: "How We Fight for Our Lives", author: "Saeed Jones", published: 2019 },
  { title: "Well-Read Black Girl", author: "Glory Edim", published: 2018 },
  { title: "I Know Why the Caged Bird Sings", author: "Maya Angelou", published: 1969 },
  { title: "Gingerbread", author: "Helen Oyeyemi", published: 2019 },
  { title: "Sister Outsider: Essays and Speeches", author: "Audre Lorde", published: 1984 },
  { title: "Who Fears Death", author: "Nnedi Okorafor", published: 2010 },
  { title: "The Street", author: "Ann Petry", published: 1946 },
  { title: "Kindred", author: "Octavia Butler", published: 1979 },
]

const fetchBookData = async ({ title, author, published }) => {
  const query = encodeURIComponent(`${title} ${author}`)
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`)
  const data = await res.json()
  const item = data.items?.[0]?.volumeInfo

  return {
    title,
    author,
    published,
    description: item?.description
      ? item.description.slice(0, 250) + '...'
      : 'No description available',
    image: item?.imageLinks?.thumbnail ?? null,
  }
}

const fetchAllBooks = () => Promise.all(BOOKS.map(fetchBookData))

const App = () => {
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [showPanel, setShowPanel] = useState(false)
  const [filteredBooks, setFilteredBooks] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const books = await fetchAllBooks()
        setBooks(books)
        setFilteredBooks(books)
      } catch (error) {
        console.error('Failed to fetch books:', error)
      }
    }
    loadBooks()
  }, [])

  const pickBook = (book) => {
    setSelectedBook(book)
    setShowPanel(true)
  }

  const closePanel = () => setShowPanel(false)

  const filterBooks = (searchTerm) => {
    const stringSearch = (bookAttribute, searchTerm) =>
      bookAttribute.toLowerCase().includes(searchTerm.toLowerCase())
    if (!searchTerm) {
      setFilteredBooks(books)
    } else {
      setFilteredBooks(
        books.filter(
          (book) => stringSearch(book.title, searchTerm) || stringSearch(book.author, searchTerm)
        )
      )
    }
    setSearch(searchTerm)
  }

  const hasFiltered = filteredBooks.length !== books.length

  return (
    <>
      <GlobalStyle />
      <Header>
        <Search filterBooks={filterBooks} />
      </Header>
      <BooksContainer
        books={filteredBooks}
        pickBook={pickBook}
        isPanelOpen={showPanel}
        title={hasFiltered ? `Search results for "${search}"` : 'All books'}
      />
      <Transition in={showPanel} timeout={300}>
        {(state) => <DetailPanel book={selectedBook} closePanel={closePanel} state={state} />}
      </Transition>
    </>
  )
}

export default App
