import React from "react"

const item = {
  options: [
    {
      key: "default",
      data: () => <g key="default" />,
    },
    {
      key: "glasses square",
      data: color => (
        <g key="glasses square">
          <path
            fill={color}
            d="M385.8 206h-38.3c-5.7-4.6-12.8-7-20-7h-26c-7.6 0-14.8 2.6-20.6 7.4h-60.4c-5.8-4.8-13-7.4-20.6-7.4h-25.8c-7.4 0-14.5 2.4-20.2 7h-40v15h26v26c0 8 3 15.3 8.7 21l5.7 5.6c5.2 5.2 12 8 19.3 8h28.8c6.3 0 12.3-2.5 16.8-7l8.6-8.6c4.4-4.5 7-10.5 7-17v-10l5.5-1.8c6.3-2 13-2 19.3 0l7.3 2.4v9.4c0 6.4 2.6 12.4 7 17l8.7 8.5c4.5 4.5 10.5 7 16.8 7h28.8c7.3 0 14.2-2.8 19.3-8l5.7-5.7c5.6-5.6 8.7-13 8.7-21v-26h24v-15zm-166 43c0 2.5-1 4.7-2.6 6.4l-8.6 8.6c-1.7 1.7-4 2.6-6.2 2.6h-28.8c-3.3 0-6.4-1.3-8.7-3.6l-5.8-5.7c-2.8-2.8-4.3-6.4-4.3-10.3v-21l7-7c3.2-3.3 7.7-5.2 12.2-5.2H200c4.6 0 9 2 12.3 5.2l5.4 5.4c1.3 1.3 2 3 2 5V249zm127-2c0 4-1.6 7.6-4.4 10.3l-5.7 5.7c-2.3 2.3-5.4 3.6-8.7 3.6h-28.8c-2.3 0-4.5-1-6.2-2.6l-8.6-8.6c-1.7-1.7-2.6-4-2.6-6.3v-19.7c0-1.8.7-3.6 2-5l5.4-5.3c3.3-3.3 7.6-5 12.3-5l25.8-.2c4.5 0 9 1.8 12.2 5l7 7.2v21z"
          />
        </g>
      ),
    },
    {
      key: "glasses future",
      data: color => (
        <g key="glasses future">
          <path
            fill={color}
            style={{ opacity: 0.9 }}
            d="M130.3,209.8v50.7c0,13.8,11.1,25,24.7,25h48.6c9.4,0,18-5.4,22.2-14l4.3-9c2.3-4.7,7-7.7,12.1-7.7h15.9c5.2,0,9.9,3,12.1,7.7l4.3,9c4.1,8.6,12.7,14,22.2,14h48.6c13.6,0,24.7-11.2,24.7-25v-50.7H130.3z"
          />
          <path
            style={{
              fill: "#fff",
              mixBlendMode: "soft-light",
            }}
            d="M283.3,209.8h-9.4v60.3l0.7,1.4c2,4.2,5.1,7.6,8.8,10V209.8z"
          />
          <path
            style={{
              fill: "#fff",
              opacity: 0.5,
              mixBlendMode: "soft-light",
            }}
            d="M273.9,209.8h-24v45h8.2c5.2,0,9.9,3,12.1,7.7l3.7,7.6V209.8z"
          />
          <path
            style={{
              fill: "#fff",
              opacity: 0.5,
              mixBlendMode: "soft-light",
            }}
            d="M154.9,285.6C154.9,285.6,155,285.6,154.9,285.6l11.1,0v-75.7h-11.1V285.6z"
          />
          <path
            style={{
              fill: "#fff",
              mixBlendMode: "soft-light",
            }}
            d="M140.2,280.6c4.1,3.1,9.2,5,14.7,5v-75.7h-14.7V280.6z"
          />
          <path
            style={{
              fill: "#fff",
              opacity: 0.6,
              mixBlendMode: "soft-light",
            }}
            d="M225.7,209.8h-18.2v75.4c7.8-1.3,14.6-6.3,18.2-13.7l0,0V209.8z"
          />
          <path
            style={{
              fill: "#fff",
              opacity: 0.8,
              mixBlendMode: "soft-light",
            }}
            d="M317.3,285.6h27.4c2.4,0,4.4-0.2,7-0.8v-74.9h-34.4V285.6z"
          />
        </g>
      ),
    },
    {
      key: "glasses 3d",
      data: color => (
        <g key="glasses 3d">
          <rect
            fill="#00AEEF"
            opacity="0.8"
            x="155"
            y="213.5"
            width="64.8"
            height="53.2"
          />
          <rect
            fill="#ED1C24"
            opacity="0.8"
            x="280.2"
            y="213.5"
            width="64.8"
            height="53.2"
          />
          <path
            fill={color}
            d="M385.6,198.5H114.4c-7.5,0-15.5,5.2-15.5,14.9c0,9.7,8,14.9,15.5,14.9v-14.8c0,0,0,0,0,0H140v68.2h94.8l6.3-25.1c0.6-2.2,2.6-3.8,4.9-3.8h4.1h3.2c2.2,0,4.2,1.5,4.8,3.6l7.2,25.2H360v-68.2h25.4c0,0,0.1,0.1,0.1,0.1v14.7c7.5,0,15.5-5.2,15.5-14.9C401.1,203.8,393.1,198.5,385.6,198.5z M219.8,266.7H155v-53.2h9.2h55.6V266.7z M345,266.7h-64.8v-53.2h55.6h9.2V266.7z"
          />
          <path
            style={{
              fill: "#fff",
              mixBlendMode: "soft-light",
            }}
            d="M208.7,213.5l-53.2,53.2H155v-28.3l25-25H208.7z"
          />
          <path
            style={{
              fill: "#fff",
              mixBlendMode: "soft-light",
            }}
            d="M155,219.6l6-6h11.3L155,230.9V219.6z"
          />
          <path
            style={{
              fill: "#fff",
              mixBlendMode: "soft-light",
            }}
            d="M334.3,213.5l-53.2,53.2h-0.5v-28.3l25-25H334.3z"
          />
          <path
            style={{
              fill: "#fff",
              mixBlendMode: "soft-light",
            }}
            d="M280.6,219.6l6-6h11.3l-17.3,17.3V219.6z"
          />
        </g>
      ),
    },
  ],
  colors: [
    "#F3F3F3",
    "#C7C7C7",
    "#2D2D2D",
    "#E83D3D",
    "#B73DE8",
    "#3D88E8",
    "#8DC63F",
    "#FF9700",
    "#924C2C",
  ],
}

export default item
