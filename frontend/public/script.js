/* ----- taking a JSON as input and parsing it to produce a JavaScript object using json() method */

const parseJSON = async (url) => {
    const response = await fetch(url);
    return response.json();
}

/* ----- function to make a <div> in which the slides appears; iterating through data.json and actual iteration passing in as argument to the callback */

const swiperComponent = (data, comp) => {
    return `
        <div class="swiper">
            <div class="swiper-wrapper">
            ${data.map(img => comp(img)).join('')}
            </div>
        </div>
    `
}

/* ----- function to create the individual slides; params are passed in by destructuring */

const swiperSlideComponent = ({filename, title, nameOfPhotographer}) => {
    return `
        <div class="swiper-slide">
            <h2>${title}<br>photographer: ${nameOfPhotographer}</h2>
            <img src='/public/img/${filename}'>
            <button class='deleteBtn' value='${filename}'>Delete</button>
        </div>
    `;
  
}
/* ----- header with text and three empty <div>-s for background-pictures*/
const headerElement = () => {
    return `
        <div id='header'>
            <h1 id='title'>
                <span>The Miracle</span>
                <span>of Music</span>
                <span>Manuscripts</span>
            </h1>
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    `
}

/* ----- form element for uploading pictures rendered between the header and the swiper-slides */

const formElement = () => {
    return `
        <form id='form'>
            <input id='pictureUpload' type='file' name='picture'required>
            <label for='pictureUpload'>Add New File</label>
            <input id='title' type='text' name='title' placeholder='Title of Picture' required>
            <input id='nameOfPhotographer' type='text' name='nameOfPhotographer' placeholder='Photographer's Name' required>
            <input type='submit'>
        </form>
    `
}

const loadEvent = async () => {
    // console.log('hello');

    /* ----- catching the <div id='root'> of index.html */
    const rootElement = document.getElementById('root');
    
    
    /* ----- fetching the data */
    const result = await parseJSON('/image-list');
    // console.log(result);

    /* ----- inserting the headerElement */
    rootElement.insertAdjacentHTML('beforeend', headerElement())

    /* ----- catching the headerElement and inserting the formElement after it */
    const headerInTheDOM = document.getElementById('header');
    headerInTheDOM.insertAdjacentHTML('afterend', formElement())

    
    /* ------ catching the formElement, adding an eventListener and creating formData for file upload */
    const formToSubmit = document.getElementById('form');
    formToSubmit.addEventListener('submit', e => {
        e.preventDefault();
        console.log(e.timeStamp);

        const formData = new FormData()
        // console.log(e.target.querySelector(`input[name='picture']`).files[0].name);
        formData.append('filename', e.target.querySelector(`input[name='picture']`).files[0].name)
        formData.append('title', e.target.querySelector(`input[name='title']`).value)
        formData.append('nameOfPhotographer', e.target.querySelector(`input[name='nameOfPhotographer']`).value)
        formData.append('dateOfUpload', e.timeStamp)
        formData.append('picture', e.target.querySelector(`input[name='picture']`).files[0])
        console.log(e.target.querySelector(`input[name='picture']`).files[0]);

        /* ----- creating a variable containing the settings of POST request and make the fetch */
        const fetchSettings = {
            method: 'POST',
            body: formData
        };

        fetch('/post', fetchSettings)
            .then((data) => {
                if (data.status === 200) {
                    /* e.target.outerHTML = 'done'; */
                    console.dir(data);
                }
            })
            /* ---- document.location doesn't work yet */
            .then (() => document.location.reload(true))
            .catch(error => {
                /* e.target.outerHTML = 'Error' */
                console.dir(error)
            })
        


    })
    
    /* inserting the swiper-slide element */
    rootElement.insertAdjacentHTML('beforeend', swiperComponent(result, swiperSlideComponent));
    /* set the loop feature of swiper-slide */
    const swiper = new Swiper('.swiper', {
        loop: true,
    })

    /* catching the delete buttons of the individual slides*/
    const deleteBtnElement = document.querySelectorAll('.deleteBtn')
    
    /* adding eventListener to each delet button */
    for (const button of deleteBtnElement) {
        button.addEventListener('click', (e) =>{
            
            /* creating variable for body of DELETE request */
            const itemToDelete = {"filename": `${e.target.value}`}
            const itemToDeleteJSON = JSON.stringify(itemToDelete)
            
            /* makeing the fetch with DELETE request */
            fetch('/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: itemToDeleteJSON
            })
            .then((data) => console.log(data))
        })
    }
    
}

window.addEventListener('load', loadEvent)