/* if you want to use special LP images for specific albums or artists */
const SPECIAL_DISCS=[
	{
		image: 'lp_red',
		artist: /(Nintendo|Koji Kondo)/i,
		album: /(Zelda|Smash Bros)/i
	}, {
		image: 'lp_blue',
		artist: /(Sega|Yuzo Koshiro)/i,
		album: /(Sonic|Streets of Rage)/i
	}
];


/* if you want to use custom background positions for each album */
const BACKGROUND_POSITIONS=[
	{
		position:'bottom',
		album: /Super Mario Odyssey/i
	}, {
		position:'80%',
		album: /Sonic Adventure 2/i
	}
];