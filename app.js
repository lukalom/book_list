// book class represents a book
class Book{
    constructor(title, author, isbn){
        this.title = title
        this.author = author
        this.isbn = isbn
    }
    
}
// UI class handle ui tasks
class Ui{
    static displayBooks(){
        const books = Store.getBooks()
        
        books.forEach(book => Ui.addBookTable(book));
    }
    static addBookTable(book){
        const tbody = document.querySelector('#book-list')
        const row = document.createElement('tr')

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="fas fa-trash text-danger delete"></a></td>
        `
        tbody.appendChild(row)
    }
    
    static deleteBook(e){
        if (e.target.classList.contains('delete')){
            e.target.parentElement.parentElement.remove()
        }
    }
    static showAlert(message, className){
        const div = document.createElement('div')
        div.className =`alert alert-${className}`
        div.appendChild(document.createTextNode(message))

        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form)
        
        // gaqres 3 wamshi
        setTimeout(()=>document.querySelector('.alert').remove(), 3000)
    }

    static clearForms(){
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }
}

// Store class handle localsotrage tasks
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = []
        }else{
            // mogvaqvs string amitom vuwer json.parse da wamoigebs json formats objects
            books = JSON.parse(localStorage.getItem('books'))
        }
        
        // vabrunebt book objects
        return books    
    }
   
    static addBook(book) {
        // wamoviget wignebi local storagedan
        const books = Store.getBooks()
        // davamatet axali wingi storageshi
        books.push(book)
        // da axla unda davarestartot storage
        // JSON.stringify imitom cahvweret rom local storageshi iwereba marto string
        // amitom objecti gadaiyvana mtlianad stringshi
        localStorage.setItem('books', JSON.stringify(books))
    }

    // imisatvisrom  amovshalot wigni sachiroa misi unikaluroba romelic 
    // gansazgvravs isbn id msgavsi ramea yvela wigns unikaluri aqvs
    static removeBook(isbn){
        const books = Store.getBooks()

        // books aris titon object xolo index ukve misi mdebareoba listshi 
        books.forEach((book, index) => {
            if(book.isbn === isbn){

                books.splice(index, 1)
            }
        })
        // varestartebt yvelafris shemdeg local storages
        localStorage.setItem('books', JSON.stringify(books))
    }
}



// event listeners
document.addEventListener('DOMContentLoaded', Ui.displayBooks())


// add book event
document.querySelector('#book-form').addEventListener('submit', e => {
    // shvelis 
    e.preventDefault()

    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    if (title === '' || author === '' || isbn === ''){
        Ui.showAlert('Please fill in all fields', 'danger')
    }else{
      
        const book = new Book(title, author, isbn)

        Ui.addBookTable(book)

        // add book to store
        Store.addBook(book)

        // books added
        Ui.showAlert('Book Added', 'success')

        Ui.clearForms()
    }
    
})


// remove book from list
document.querySelector("#book-list").addEventListener('click', e=>{
    Ui.deleteBook(e)
    // books removed
    Ui.showAlert('Book Removed', 'success')

    // remove book from store
    // e.target vwvdebit chvens tr parent elementit ukve td da sibling elementit 
    // arsebuli td zevita elements da mogvaqvs misi contenti text
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

})