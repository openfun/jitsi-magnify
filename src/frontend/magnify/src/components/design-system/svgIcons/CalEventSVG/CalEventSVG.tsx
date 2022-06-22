import React from 'react';
import SVGIcon, { SvgProps } from '../SVGIcon';

export default function CalEventSVG(svgProps: SvgProps) {
  return (
    <SVGIcon viewBox={{ x: 0, y: 0, width: 17, height: 18 }} {...svgProps}>
      <g id="Bank" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Bank-Colors-&amp;-Iko" transform="translate(-54.000000, -779.000000)" fill="#055FD2">
          <g id="•-icones" transform="translate(50.000000, 691.000000)">
            <g id="iko/cal-event" transform="translate(4.000000, 88.000000)">
              <path
                d="M11.7,9.9 L9,9.9 C8.505,9.9 8.1,10.305 8.1,10.8 L8.1,13.5 C8.1,13.995 8.505,14.4 9,14.4 L11.7,14.4 C12.195,14.4 12.6,13.995 12.6,13.5 L12.6,10.8 C12.6,10.305 12.195,9.9 11.7,9.9 Z M11.7,0.9 L11.7,1.8 L4.5,1.8 L4.5,0.9 C4.5,0.405 4.095,0 3.6,0 C3.105,0 2.7,0.405 2.7,0.9 L2.7,1.8 L1.8,1.8 C0.801,1.8 0.009,2.61 0.009,3.6 L-4.4408921e-16,16.2 C-4.4408921e-16,17.19 0.801,18 1.8,18 L14.4,18 C15.39,18 16.2,17.19 16.2,16.2 L16.2,3.6 C16.2,2.61 15.39,1.8 14.4,1.8 L13.5,1.8 L13.5,0.9 C13.5,0.405 13.095,0 12.6,0 C12.105,0 11.7,0.405 11.7,0.9 Z M13.5,16.2 L2.7,16.2 C2.205,16.2 1.8,15.795 1.8,15.3 L1.8,6.3 L14.4,6.3 L14.4,15.3 C14.4,15.795 13.995,16.2 13.5,16.2 Z"
                id="Shape"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </SVGIcon>
  );
}
