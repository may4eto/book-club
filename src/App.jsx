import React, {useState, useEffect} from 'react'
import Header from './components/Header'
import Search from './components/Search'
import BooksContainer from './components/BooksContainer'
import DetailPanel from './components/DetailPanel'
import {GlobalStyle} from './styles'
import {Transition} from 'react-transition-group'

const App = () => {
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [showPanel, setShowPanel] = useState(false)
  const [filteredBooks, setFilteredBooks] = useState([])
  const [search, setSearch] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://book-club-json.herokuapp.com/books')
        if (response.status === 200) {
          const books = await response.json()
          setBooks(books)
          setFilteredBooks(books)
        }
      } catch (errors) {
        console.log(errors)
      }
    }
    fetchData()
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
