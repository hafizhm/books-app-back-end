const { response } = require('@hapi/hapi/lib/validation');
const { nanoid } = require('nanoid');
const books = require('./books')


// add
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt,
      };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if(readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
  
    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId : id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(500);
      return response;

    }

// read all
const getAllBooksHandler = (request, h) => {
  const response = h.response ({
    status: 'success',
    data: {
      books: books.map((n) => ({
        id: n.id,
        name: n.name,
        publisher: n.publisher,
      })),
    },
  });
   response.code(200);
   return response;
  };
 

// read by ID
const getBookByIdHandler = (request, h) => {
    const { bookId  } = request.params;

    //const finished = pageCount === readPage;
 
    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
      if(pageCount === readPage) {
      const response = h.response ({
        status: 'success',
        data: {
            book,
            finished: true,
          },
      });
      response.code(200);
      return response;
      }
      else {
        const response = h.response ({
          status: 'success',
          data: {
              book,
              finished: false,
            },
        });
        response.code(200);
        return response;
      }
    }

      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
};

// edit
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    // kalo dapet id books nya , pastiin ID nya bukan -1
    if(index !== -1) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage, 
          reading,
          updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
          });
          response.code(200);
          return response;
        }   
        
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
          });
          response.code(404);
          return response;
};

// delete
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;

};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };