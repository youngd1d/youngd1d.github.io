///////////////////
// PAGE ELEMENTS //
///////////////////

const mainWrapper = document.getElementById('main-wrapper');
const albumArtContainer = document.getElementById('album-art-container');
const songInfoContainer = document.getElementById('song-info-container');
const songInfoWrapper = document.getElementById('song-info-wrapper');

const albumArtLayer = document.getElementById('album-art-layer');
const albumArtTransition = document.getElementById('album-art-transition-layer');

const backgroundLayer = document.getElementById('background-layer');
const backgroundTransitionLayer = document.getElementById('background-transition-layer');

const trackLabel = document.getElementById('track-label');
const artistLabel = document.getElementById('artist-label');

const progressContainer = document.getElementById('progress-container');
const progressBarFill = document.getElementById('progress-bar-fill');

const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');


////////////////
// PAGE SETUP //
////////////////


// This theme has variants
const themeVariant = window.ThemeVariant
    ? window.ThemeVariant
    : '';


// =========================================================
// NAUTILUS 002 CUSTOM SETTINGS
// =========================================================

// Read Album Art Size from the URL / Settings page
const albumArtSize = GetIntParam("albumArtSize", 100);

// Pass the value to CSS
document.documentElement.style.setProperty(
    '--album-art-size',
    `${albumArtSize}px`
);


// =========================================================
// STANDARD THEME SETUP
// =========================================================


// Set property visibility
trackLabel.style.display = showPrimary ? '' : 'none';
artistLabel.style.display = showSecondary ? '' : 'none';


// Set container width
if (maxWidth > 0) {
    mainWrapper.style.width = `${maxWidth}px`;
}
else {
    mainWrapper.style.width = `100%`;
}


// Set progress bar visibility
if (!showProgressBar) {
    progressContainer.style.display = 'none';
}


// Theme specific setup
switch (themeVariant) {

    case "matte":
    case "matte-dark":

        backgroundLayer.style.display = 'none';
        backgroundTransitionLayer.style.display = 'none';

        break;
}


// If text alignment is 'right',
// swap the album art to the right hand side too
if (textAlignment == 'right') {
    songInfoContainer.style.flexDirection = 'row-reverse';
}



////////////////////
// CORE FUNCTIONS //
////////////////////


async function ChangeTrack(mediaProps, accentColorPalette) {

    // Fade out text if it changed
    if (
        trackLabel.innerText !=
        (swapArtistTrack ? mediaProps.Artist : mediaProps.Title)
    ) {
        trackLabel.style.opacity = "0";
    }

    if (
        artistLabel.innerText !=
        (swapArtistTrack ? mediaProps.Title : mediaProps.Artist)
    ) {
        artistLabel.style.opacity = "0";
    }


    // Fade out old artwork/background
    backgroundLayer.style.opacity = "0";
    albumArtLayer.style.opacity = "0";


    // Wait for fade
    setTimeout(async () => {

        // Update track / artist
        SetLabelText(
            'track-label',
            swapArtistTrack
                ? mediaProps.Artist
                : mediaProps.Title
        );

        SetLabelText(
            'artist-label',
            swapArtistTrack
                ? mediaProps.Title
                : mediaProps.Artist
        );


        // =================================================
        // TEXT COLORS
        // =================================================

        if (!useCustomColors) {

            switch (themeVariant) {

                case "matte":

                    document.body.style.color =
                        accentColorPalette.DarkVibrant;

                    break;


                case "matte-dark":

                    document.body.style.color =
                        accentColorPalette.LightVibrant;

                    break;
            }
        }
        else {

            switch (themeVariant) {

                case "matte":

                    document.body.style.color = color2;

                    break;


                default:

                    document.body.style.color = color1;

                    break;
            }
        }


        // =================================================
        // ALBUM ART
        // =================================================

        const newArtUrl =
            mediaProps.Thumbnail ??
            './images/placeholder.png';


        // =================================================
        // BACKGROUND COLORS
        // =================================================

        if (!useCustomColors) {

            switch (themeVariant) {

                case "matte":

                    songInfoContainer.style.backgroundColor =
                        accentColorPalette.LightVibrant;

                    break;


                case "matte-dark":

                    songInfoContainer.style.backgroundColor =
                        `color-mix(in srgb, ${accentColorPalette.DarkMuted}, black 60%)`;

                    break;
            }
        }
        else {

            switch (themeVariant) {

                case "matte":

                    songInfoContainer.style.backgroundColor =
                        color1;

                    break;


                default:

                    songInfoContainer.style.backgroundColor =
                        `color-mix(in srgb, ${color2}, black 60%)`;

                    break;
            }
        }


        // =================================================
        // SET ARTWORK
        // =================================================

        backgroundLayer.style.backgroundImage =
            `url('${newArtUrl}')`;

        albumArtLayer.style.backgroundImage =
            `url('${newArtUrl}')`;


        // Apply tint
        backgroundLayer.style.backgroundColor =
            accentColorPalette.DarkMuted + "80";


        // Fade new content in
        trackLabel.style.opacity = "";
        artistLabel.style.opacity = "";
        backgroundLayer.style.opacity = "";
        albumArtLayer.style.opacity = "";


        setTimeout(() => {

            backgroundTransitionLayer.style.backgroundImage =
                `url('${newArtUrl}')`;

            albumArtTransition.style.backgroundImage =
                `url('${newArtUrl}')`;


            // Apply tint
            backgroundTransitionLayer.style.backgroundColor =
                accentColorPalette.DarkMuted + "80";


            // Show widget
            SetVisibility(true);

        }, 250);

    }, 250);
}



function SetProgressInfo(
    timelineProps,
    currentPositionMs,
    accentColorPalette,
    playbackStatus
) {

    // =====================================================
    // CURRENT TIME
    // =====================================================

    currentTimeLabel.innerText =
        ConvertMillisecondsToHoursMinutesSecondsSoItLooksBetterAndNotCringe(
            currentPositionMs
        );


    // =====================================================
    // TRACK DURATION
    // =====================================================

    durationLabel.innerText =
        ConvertMillisecondsToHoursMinutesSecondsSoItLooksBetterAndNotCringe(
            timelineProps.EndTime
        );


    // =====================================================
    // PAUSE OVERLAY
    // =====================================================

    if (playbackStatus === PlaybackStatus.PAUSED) {

        albumArtContainer.classList.add('is-paused');

    }
    else {

        albumArtContainer.classList.remove('is-paused');

    }


    // =====================================================
    // PROGRESS BAR
    // =====================================================

    const durationMs = timelineProps.EndTime;

    let progressPercent =
        durationMs > 0
            ? (currentPositionMs / durationMs) * 100
            : 0;


    progressPercent =
        Math.min(
            100,
            Math.max(0, progressPercent)
        );


    progressBarFill.style.width =
        `${progressPercent}%`;


    progressBarFill.style.setProperty(
        '--accent-color',
        accentColorPalette.LightVibrant
    );


    // =====================================================
    // ACCENT COLORS
    // =====================================================

    if (!useCustomColors) {

        switch (themeVariant) {

            case "matte":

                document.body.style.setProperty(
                    '--accent-color',
                    accentColorPalette.DarkVibrant
                );

                break;


            case "matte-dark":

                document.body.style.setProperty(
                    '--accent-color',
                    accentColorPalette.LightVibrant
                );

                break;


            default:

                progressBarFill.style.setProperty(
                    '--accent-color',
                    accentColorPalette.LightVibrant
                );

                break;
        }
    }
    else {

        switch (themeVariant) {

            case "matte":

                document.body.style.setProperty(
                    '--accent-color',
                    color2
                );

                break;


            default:

                document.body.style.setProperty(
                    '--accent-color',
                    color1
                );

                break;
        }
    }
}
