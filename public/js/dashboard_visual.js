const axiosBtn_initial = document.querySelector('#axiosBtn_initial');
const axiosBtn_preadvise = document.querySelector('#axiosBtn_preadvise');

axiosBtn_initial.addEventListener('click', () => {
        axios.post("/dashboard/test_initial")
        .then(function (response) {
            let results = response.data;
                for(let result of results) {
                    console.log(result);
                }
            })
        .catch(function (error) {
            console.log(error);
        })
    }
);

axiosBtn_preadvise.addEventListener('click', () => {
    axios.post("/dashboard/test_numPreadvise")
    .then(function (response) {
        let results = response.data;
        console.log(results);
            // for(let result of results) {
            //     console.log(result);
            // }
        })
    .catch(function (error) {
        console.log(error);
    })
});
