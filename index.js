const { animate } = anime;
const utils = anime.utils
const spring = anime.spring
const createDraggable = anime.createDraggable

const [ $logo ] = utils.$('.logo.in');

// Created a bounce animation loop
animate('.logo.in', {
  scale: [
    { to: 1.25, ease: 'inOut(3)', duration: 200 },
    { to: 1, ease: spring({ bounce: .7 }) }
  ],
  loop: true,
  loopDelay: 250,
});

// Make the logo draggable around its center
createDraggable('.logo.in', {
  container: [0, 0, 0, 0],
  releaseEase: spring({ bounce: .75 })
});
