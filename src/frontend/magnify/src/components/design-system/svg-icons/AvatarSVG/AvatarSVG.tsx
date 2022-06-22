import React from 'react';
import SVGIcon, { SvgProps } from '../SVGIcon';

export default function AvatarSVG(svgProps: SvgProps) {
  return (
    <SVGIcon viewBox={{ x: 0, y: 0, width: 20, height: 20 }} {...svgProps}>
      <g id="Bank" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          id="Bank-Colors-&amp;-Iko"
          transform="translate(-592.000000, -778.000000)"
          fill="#055FD2"
        >
          <g id="•-icones" transform="translate(50.000000, 691.000000)">
            <g id="iko/avatar" transform="translate(542.000000, 87.000000)">
              <path
                d="M10,0 C4.48,0 0,4.48 0,10 C0,15.52 4.48,20 10,20 C15.52,20 20,15.52 20,10 C20,4.48 15.52,0 10,0 Z M10,3 C11.66,3 13,4.34 13,6 C13,7.66 11.66,9 10,9 C8.34,9 7,7.66 7,6 C7,4.34 8.34,3 10,3 Z M10,17.2 C7.5,17.2 5.29,15.92 4,13.98 C4.03,11.99 8,10.9 10,10.9 C11.99,10.9 15.97,11.99 16,13.98 C14.71,15.92 12.5,17.2 10,17.2 Z"
                id="Fill-1"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </SVGIcon>
  );
}
