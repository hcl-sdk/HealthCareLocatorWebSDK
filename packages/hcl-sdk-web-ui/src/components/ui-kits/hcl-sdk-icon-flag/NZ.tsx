import { h } from '@stencil/core';

export default () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="1em" width="1em" viewBox="0 0 900 500">
<defs>
	<clipPath id="Canton">
		<path d="M 0,0 L 600,0 L 600,300 L 0,300 z"/>
	</clipPath>
	<clipPath id="Diagonals">
		<path d="M 0,0 L 300,150 L 0,150 z M 300,0 L 600,0 L 300,150 z M 300,150 L 600,150 L 600,300 z M 300,150 L 300,300 L 0,300 z"/>
	</clipPath>
	<g id="Pentagram">
		<g id="Arm" transform="translate(0,-0.324925)">
			<path d="M 0,0 L 0,0.5 L 1,0 z"/>
			<path d="M 0,0 L 0,-0.5 L 1,0 z" transform="rotate(-36,1,0)"/>
		</g>
		<use xlinkHref="#Arm" href="#Arm" transform="scale(-1,1)"/>
		<use xlinkHref="#Arm" href="#Arm" transform="rotate(72,0,0)"/>
		<use xlinkHref="#Arm" href="#Arm" transform="rotate(-72,0,0)"/>
		<use xlinkHref="#Arm" href="#Arm" transform="rotate(-72,0,0) scale(-1,1)"/>
	</g>
</defs>

<rect fill="#012169" x="0" y="0" width="1200" height="600"/>

<g id="Flag_of_the_United_Kingdom">
	<path id="Saint_Andrews_Cross" stroke="#FFF" d="M 0,0 L 600,300 M 0,300 L 600,0" stroke-width="60" clip-path="url(#Canton)"/>
	<path id="Saint_Patricks_Cross" stroke="#C8102E" d="M 0,0 L 600,300 M 0,300 L 600,0" stroke-width="40" clip-path="url(#Diagonals)"/>
	<g id="Saint_Georges_Cross">
		<path stroke="#FFF" d="M 300,0 L 300,300 M 0,150 L 600,150" stroke-width="100" clip-path="url(#Canton)"/>
		<path stroke="#C8102E" d="M 300,0 L 300,300 M 0,150 L 600,150" stroke-width="60" clip-path="url(#Canton)"/>
	</g>
</g>

<g id="Southern_Cross">
	<g id="Gamma_Crucis">
		<use xlinkHref="#Pentagram" href="#Pentagram" fill="#FFF" transform="translate(900,120) scale(45.4)"/>
		<use xlinkHref="#Pentagram" href="#Pentagram" fill="#C8102E" transform="translate(900,120) scale(30)"/>
	</g>
	<g transform="rotate(82,900,240)">
		<g id="Delta_Crucis">
			<use xlinkHref="#Pentagram" href="#Pentagram" fill="#FFF" transform="translate(900,120) rotate(-82) scale(40.4)"/>
			<use xlinkHref="#Pentagram" href="#Pentagram" fill="#C8102E" transform="translate(900,120) rotate(-82) scale(25)"/>
		</g>
		<g id="Beta_Crucis">
			<use xlinkHref="#Pentagram" href="#Pentagram" fill="#FFF" transform="translate(900,380) rotate(-82) scale(45.4)"/>
			<use xlinkHref="#Pentagram" href="#Pentagram" fill="#C8102E" transform="translate(900,380) rotate(-82) scale(30)"/>
		</g>
	</g>
	<g id="Alpha_Crucis">
		<use xlinkHref="#Pentagram" href="#Pentagram" fill="#FFF" transform="translate(900,480) scale(50.4)"/>
		<use xlinkHref="#Pentagram" href="#Pentagram" fill="#C8102E" transform="translate(900,480) scale(35)"/>
	</g>
</g></svg>
);
