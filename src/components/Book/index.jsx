import React from 'react'
import {Container, Author, Title, Cover} from './styles'

const Book = ({book, pickBook, isLarge, colorCover}) => (
  <Container $isLarge={isLarge} onClick={() => pickBook(book)}>
    <Cover
      $colorCover={colorCover}
      alt={`Book cover for ${book.title} by ${book.author}`}
      src={book.image}
    />
    <figcaption>
      <Title $isLarge={isLarge}>{book.title}</Title>
      <Author>by {book.author}</Author>
    </figcaption>
  </Container>
)

export default Book
