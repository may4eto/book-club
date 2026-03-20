import React from 'react'
import {Container, Author, Title, Cover} from './styles'

const Book = ({book, pickBook, isLarge, colorCover}) => (
  <Container $isLarge={isLarge} onClick={() => pickBook(book)}>
    {book.image
      ? <Cover
          $colorCover={colorCover}
          alt={`Book cover for ${book.title} by ${book.author}`}
          src={book.image}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      : null}
    <NoCover style={{display: book.image ? 'none' : 'flex'}}>
      No Cover Available
    </NoCover>
    <figcaption>
      <Title $isLarge={isLarge}>{book.title}</Title>
      <Author>by {book.author}</Author>
    </figcaption>
  </Container>
)

export default Book
