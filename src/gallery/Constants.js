/*
 * Model Resources
 * */
export const COLLISION_SCENE_URL = new URL(
  './assets/models/scene_collision.glb',
  import.meta.url
).href;
export const STATIC_SCENE_URL = new URL(
  './assets/models/scene_desk_obj.glb',
  import.meta.url
).href;

/*
 * Texture Resources
 * */
export const BOARD_TEXTURES = [
  new URL('./assets/boards/1.png', import.meta.url).href,
  new URL('./assets/boards/2.png', import.meta.url).href,
  new URL('./assets/boards/3.jpg', import.meta.url).href,
  new URL('./assets/boards/4.jpg', import.meta.url).href,
  new URL('./assets/boards/5.png', import.meta.url).href,
  new URL('./assets/boards/6.png', import.meta.url).href,
  new URL('./assets/boards/7.png', import.meta.url).href,
  new URL('./assets/boards/8.jpg', import.meta.url).href,
  new URL('./assets/boards/9.jpg', import.meta.url).href,
  new URL('./assets/boards/10.png', import.meta.url).href,
];

/*
 * Audio Resources
 * */
export const AUDIO_URL = new URL('./assets/audio/music.m4a', import.meta.url)
  .href;

/*
 * Board Info
 * */
export const BOARDS_INFO = {
  1: {
    title: 'Little Orange',
    author: 'Artist',
    describe: `
		It stands in the center of the frame, quietly gazing at the audience. The soft orange color delicately outlines its fluffy fur and lively eyes.<br>
		The kitten's small ears are slightly perked up, as if listening to something, and its body leans forward slightly, showing its curiosity and sensitivity to the surrounding world.<br>
		The background of the painting is mainly light blue, creating a warm and gentle atmosphere, making people feel as if they are in a sunny afternoon.<br>
		The entire artwork is delicate and exquisite, with bright and warm colors, bringing people a sense of warmth and intimacy.
		`,
  },
  2: {
    title: 'Glimmer',
    author: 'Artist',
    describe: `
		Tiny starlight and the Milky Way form a mysterious cosmic world, evoking infinite reverie and imagination.<br>
		When you gaze at this painting, you feel endless depth and tranquility.<br>
		You seem to be in a night sky without noise or disturbance. In this peaceful space, you can see the glimmering light flickering in the Milky Way.<br>
		These glimmers seem to be the only living beings in the night sky, weakly yet firmly emitting light, illuminating the entire galaxy.<br>
		These glimmers are so delicate yet powerful, as if in the endless darkness, only they can bring hope and strength to people.
		`,
  },
  3: {
    title: 'Swan',
    author: 'Artist',
    describe: `
		The lake surface is as calm as a mirror. A gentle breeze passes by, creating circles of fine ripples, as if laying a crystal-clear veil for the elegant white swans.<br>
		One of the snow-white swans dances gracefully in the water, like a magnificent dancer performing on the water.<br>
		Its pure white feathers shine with a faint halo under the sunlight, as dazzling as pearls.
		`,
  },
  4: {
    title: 'Mountain Cottage',
    author: 'Artist',
    describe: `
		Peaceful and tranquil, distant mountains appear and disappear in the clouds and mist, like a dreamlike painting.<br>
		The small cottage stands quietly at the foot of the mountain, with white walls and a roof bathed in gentle sunlight, making the cottage complement its surroundings.<br>
		It reveals a natural harmonious beauty.
		`,
  },
  5: {
    title: 'Astronaut',
    author: 'Artist',
    describe: `
		The astronaut is draped in the night, wandering in the starry universe.<br>
		Although we are now in the space age and humans can already take spaceships to the moon,<br>
		we can never explore the universe inside another person's heart.
		`,
  },
  6: {
    title: 'Pink Ocean',
    author: 'Artist',
    describe: `
		Pink clouds fluffy like cotton candy spread before your eyes, a crescent moon smiling between the gaps, moonlight soft and elegant.<br>
		The purple sky is like a dream, starlight twinkling, listening silently, gently, the breeze caresses your face, quietly, life flows.
		`,
  },
  7: {
    title: 'Calm Waters',
    author: 'Artist',
    describe: `
		Row a boat, leave the shore one hundred meters, calm waters, colorful clouds slowly fade.<br>
		Row a boat, leave the shore two hundred meters, calm waters, night gently calls you.<br>
		Row a boat, leave the shore three hundred meters, calm waters, big fish laughs at my silliness.<br>
		Row a boat, leave the shore four hundred meters, calm waters, stars twinkle and smile.<br>
		Row a boat, leave the shore five hundred meters, calm waters, sea turtle waves its arm at me.
		`,
  },
  8: {
    title: 'Sunflower',
    author: 'Artist',
    describe: `
		Sunshine shines, golden flower disk.<br>
		Like a bright lamp, guiding the way forward.<br>
		Sunflower, you are faith, you are strength, you are glory, you are perseverance, you are loyalty, you are admiration, you are beauty.
		`,
  },
  9: {
    title: 'Flower · Tiger · Butterfly',
    author: 'Artist',
    describe: `
		A wonderful encounter, a combination of freedom and courage, a mysterious yet touching charm.<br>
		In this colorful sea of flowers, a tiger with butterfly wings, riding a scooter,<br>
		It's like a bolt of lightning, cutting through this beautiful heaven and earth.<br>
		Its wings gently flutter, as if it can fly away from this beautiful world at any time and fly to a broader sky.
		`,
  },
  10: {
    title: 'Dolphin',
    author: 'Artist',
    describe: `
		All turning points are hidden in dense flocks of birds, neither the sky nor the ocean can detect them, but they can be seen with beautiful dreams.<br>
		Exploring the moment of reversal, all nostalgia is hidden in similar days, the spider in the heart imitates human celebrations with lanterns and decorations.
		`,
  },
};

/*
 * Computer Iframe SRC
 * */
export const IFRAME_SRC = '/universe/index.html';

/*
 * Events
 * */
export const ON_LOAD_PROGRESS = 'on-load-progress';
export const ON_LOAD_MODEL_FINISH = 'on-load-model-finish';
export const ON_CLICK_RAY_CAST = 'on-click-ray-cast';
export const ON_SHOW_TOOLTIP = 'on-show-tooltip';
export const ON_HIDE_TOOLTIP = 'on-hide-tooltip';
export const ON_KEY_DOWN = 'on-key-down';
export const ON_KEY_UP = 'on-key-up';
export const ON_ENTER_APP = 'on-enter-app';
