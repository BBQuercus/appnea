const timerInput = document.querySelector('.timebox-input');
const timerRunning = document.querySelector('.timebox-running');
const btnStart = document.querySelector('#btn-start');
const btnReset = document.querySelector('#btn-reset');

const inputType = document.querySelector('#input-type');
const inputPrepMin = document.querySelector('#input-prep-min');
const inputPrepSec = document.querySelector('#input-prep-sec');
const inputHoldMin = document.querySelector('#input-hold-min');
const inputHoldSec = document.querySelector('#input-hold-sec');
const inputIncrMin = document.querySelector('#input-incr-min');
const inputIncrSec = document.querySelector('#input-incr-sec');
const inputSets = document.querySelector('#input-sets');

const timerType = document.querySelector('#active-description');
const timerTime = document.querySelector('#active-time');
const timerSets = document.querySelector('#active-set');


// Information popup
document.querySelector('#popup-trigger').addEventListener('click', function () {
    document.querySelector('#popup').classList.remove('hidden');
});
document.querySelector('#popup-close').addEventListener('click', function () {
    document.querySelector('#popup').classList.add('hidden');
})


// Progressbar logic
function startProgressBar(idName, duration) {
    var bar = new ProgressBar.Line(idName, {
        strokeWidth: 4,
        duration: duration,
        color: '#2198de',
        trailColor: '#949494',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' }
    });

    bar.animate(1.0);
}

// Promise to delay
const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});

// Change timebox html and trigger progressbar
const updateCountdown = async function (elType, elTime, elSet, totalSeconds, set, sets, description) {
    document.querySelector(`#progress`).innerHTML = '';
    startProgressBar(progress, 1000 * totalSeconds);

    while (totalSeconds > 0) {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        if (set !== 0) {
            elSet.innerHTML = `Set ${set}/${sets}`;
        }

        elType.innerHTML = `${description}: <br/>`;
        elTime.innerHTML = `${minutes}: ${seconds}`;

        await delay(1000);
        totalSeconds--;
    }
}

// Reseting
btnReset.addEventListener('click', function () {
    // Don't know how to stop async function
    location.reload();

    // btnStart.classList.remove('hidden');
    // timerInput.classList.remove('hidden');
    // timerInput.reset();
    // timerRunning.classList.add('hidden');

    // timerType.innerHTML = '';
    // timerTime.innerHTML = '';
    // timerSets.innerHTML = '';
    // document.querySelector('#progress').innerHTML = '';
});

// Countdown logic
btnStart.addEventListener('click', function () {

    btnStart.classList.add('hidden');
    timerInput.classList.add('hidden');
    timerRunning.classList.remove('hidden');

    const startPractice = async function (type, prep, hold, incr, sets) {
        await updateCountdown(timerType, timerTime, timerSets, 5, 0, 0, 'Get ready');

        let currHold;
        let currPrep;

        for (let set = 1; set < sets + 1; set++) {
            if (type === 'co2') {
                // CO2 -> maintain hold, decrease prep
                currPrep = prep - incr * (set - 1);
                currHold = hold;
            } else {
                // O2 -> maintain prep, increase hold
                currPrep = prep;
                currHold = hold + incr * (set - 1);
            }
            await updateCountdown(timerType, timerTime, timerSets, currHold, set, sets, 'Apnea for')
            await updateCountdown(timerType, timerTime, timerSets, currPrep, set, sets, 'Prepare for')
        }
        timerType.innerHTML = 'Training Complete!';
        timerTime.innerHTML = '';
        timerSets.innerHTML = '';
        document.querySelector('#progress').innerHTML = '';

        // Revert
        await delay(5000);
        btnStart.classList.remove('hidden');
        timerInput.classList.remove('hidden');
        timerRunning.classList.add('hidden');
    }

    // Start training
    startPractice(
        type = inputType.value,
        prep = parseInt(inputPrepMin.value) * 60 + parseInt(inputPrepSec.value),
        hold = parseInt(inputHoldMin.value) * 60 + parseInt(inputHoldSec.value),
        incr = parseInt(inputIncrMin.value) * 60 + parseInt(inputIncrSec.value),
        sets = parseInt(inputSets.value));
});
