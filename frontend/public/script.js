const parseJSON = async (url) => {
    const response = await fetch(url);
    return response.json();
}

const swiperComponent = (data, comp) => {
    return `
        <div class="swiper">
            <div class="swiper-wrapper">
            ${data.map(img => comp(img)).join('')}
            </div>
        </div>
    `
}

const swiperSlideComponent = ({filename, title, nameOfPhotographer}) => {
    return `
        <div class="swiper-slide">
            <h2>${title}<br>photographer: ${nameOfPhotographer}</h2>
            <img src='/public/img/${filename}'>
            <button class='deleteBtn' value='${filename}'>Delete</button>
        </div>
    `;
  
}

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

    const rootElement = document.getElementById('root');
    const result = await parseJSON('/image-list');
    // console.log(result);

    rootElement.insertAdjacentHTML('beforeend', headerElement())

    const headerInTheDOM = document.getElementById('header');
    headerInTheDOM.insertAdjacentHTML('afterend', formElement())

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
            .then (() => document.location.reload(true))
            .catch(error => {
                /* e.target.outerHTML = 'Error' */
                console.dir(error)
            })
        


    })
    
    rootElement.insertAdjacentHTML('beforeend', swiperComponent(result, swiperSlideComponent));

    const swiper = new Swiper('.swiper', {
        loop: true,
    })

    const deleteBtnElement = document.querySelectorAll('.deleteBtn')
    for (const button of deleteBtnElement) {
        button.addEventListener('click', (e) =>{
            const itemToDelete = {"filename": `${e.target.value}`}
            const itemToDeleteJSON = JSON.stringify(itemToDelete)
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