new p5(function (p) {
  let capture,
    bodyPose,
    poses = [];

  const CONNECTIONS = [
    [5, 6],
    [5, 7],
    [7, 9],
    [6, 8],
    [8, 10],
    [5, 11],
    [6, 12],
    [11, 12],
    [11, 13],
    [13, 15],
    [12, 14],
    [14, 16],
  ];

  p.setup = function () {
    const wrap = document.getElementById("cam-wrap");
    const cnv = p.createCanvas(
      wrap.offsetWidth || 240,
      wrap.offsetHeight || 180,
    );
    cnv.parent("cam-wrap");

    capture = p.createCapture(p.VIDEO);
    capture.size(320, 240);
    capture.hide();

    // sin flipped — imagen y keypoints en el mismo sistema de coordenadas
    bodyPose = ml5.bodyPose("MoveNet", { flipped: false }, () => {
      bodyPose.detectStart(capture, (r) => {
        poses = r;
      });
    });
  };

  p.draw = function () {
    p.clear();

    // imagen tal cual, sin espejeo
    p.image(capture, 0, 0, p.width, p.height);

    if (!poses.length) return;
    const kps = poses[0].keypoints;
    const sx = p.width / 320;
    const sy = p.height / 240;

    // conexiones
    p.stroke(255, 255, 255, 210);
    p.strokeWeight(1.5);
    p.noFill();
    CONNECTIONS.forEach(([a, b]) => {
      if (kps[a]?.confidence > 0.2 && kps[b]?.confidence > 0.2) {
        p.line(kps[a].x * sx, kps[a].y * sy, kps[b].x * sx, kps[b].y * sy);
      }
    });

    // puntos clave
    p.noStroke();
    p.fill(255, 255, 255, 230);
    [1, 2].forEach((i) => {
      if (kps[i]?.confidence > 0.25) {
        p.ellipse(kps[i].x * sx, kps[i].y * sy, 5, 5);
      }
    });
  };

  p.windowResized = function () {
    const wrap = document.getElementById("cam-wrap");
    p.resizeCanvas(wrap.offsetWidth, wrap.offsetHeight);
  };
});
