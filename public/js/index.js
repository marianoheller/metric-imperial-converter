function submitInput() {

    axios.get('/convert', {
        params: {
            input: document.getElementById('inputConverter').value,
        }
    })
    .then( (response) => {
        console.log(response.data);
        const resElement = document.getElementById('resultado');
        resElement.innerHTML = JSON.stringify(response.data);
    })
    .catch( (e) => {
        console.log(e.stack);
    })
    return false;
}