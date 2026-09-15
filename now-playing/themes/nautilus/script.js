///////////////////
// PAGE ELEMENTS //
///////////////////

const mainWrapper = document.getElementById('main-wrapper');
const albumArt = document.getElementById('album-art');
const trackLabel = document.getElementById('track-label');
const artistLabel = document.getElementById('artist-label');

const progressContainer = document.getElementById('progress-container');
const progressBarFill = document.getElementById('progress-bar-fill');

const currentTimeLabel = document.getElementById('current-time');
const durationTimeLabel = document.getElementById('duration-time');


////////////////
// PAGE SETUP //
////////////////

// Показ / приховування тексту
trackLabel.style.display = showPrimary ? '' : 'none';
artistLabel.style.display = showSecondary ? '' : 'none';

// Показ / приховування обкладинки
albumArt.style.display = showAlbumArt ? '' : 'none';

// Показ / приховування progress bar
if (!showProgressBar) {
    progressContainer.style.display = 'none';
}

// Наша тема має фіксований розмір 450px
mainWrapper.style.width = '450px';


////////////////////
// CORE FUNCTIONS //
////////////////////

// Викликається при зміні треку
async function ChangeTrack(mediaProps, accentColorPalette) {

    const title = swapArtistTrack
        ? mediaProps.Artist
        : mediaProps.Title;

    const artist = swapArtistTrack
        ? mediaProps.Title
        : mediaProps.Artist;

    // Назва треку
    SetLabelText(
        'track-label',
        title || 'Unknown Track'
    );

    // Виконавець
    SetLabelText(
        'artist-label',
        artist || 'Unknown Artist'
    );

    // Обкладинка
    const newArtUrl =
        mediaProps.Thumbnail ?? './images/placeholder.png';

    albumArt.style.backgroundImage =
        `url("${newArtUrl}")`;

    // Показуємо віджет
    SetVisibility(true);
}


// Оновлюється приблизно раз на секунду
function SetProgressInfo(
    timelineProps,
    currentPositionMs,
    accentColorPalette,
    playbackStatus
) {

    const durationMs = timelineProps.EndTime || 0;

    // Не дозволяємо часу вилізти за межі треку
    const safeCurrentPosition = Math.min(
        Math.max(currentPositionMs, 0),
        durationMs
    );

    // Скільки вже пройшло
    currentTimeLabel.innerText =
        FormatTime(safeCurrentPosition);

    // Повна довжина треку
    durationTimeLabel.innerText =
        FormatTime(durationMs);

    // Відсоток прогресу
    let progressPercent = 0;

    if (durationMs > 0) {
        progressPercent =
            (safeCurrentPosition / durationMs) * 100;
    }

    progressPercent =
        Math.min(100, Math.max(0, progressPercent));

    progressBarFill.style.width =
        `${progressPercent}%`;
}


//////////////////////
// HELPER FUNCTIONS //
//////////////////////

function FormatTime(milliseconds) {

    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
        return '0:00';
    }

    const totalSeconds =
        Math.floor(milliseconds / 1000);

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return `${minutes}:${seconds
        .toString()
        .padStart(2, '0')}`;
}
