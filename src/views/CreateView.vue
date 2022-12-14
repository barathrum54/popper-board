<template>
  <div>
    <div class="wrapper">

      <div class="side-menu">
        <h1 class="">Side Menu</h1>
      </div>
      <div class="editor">
        <div class="img_cont">
          <img class="img" id="ele1" draggable="true" @dragstart="dragElement"
            src="https://webkit.org/wp-content/uploads/STP-300x300.png">
          <img class="img" id="ele2" draggable="true" @dragstart="dragElement"
            src="https://webkit.org/wp-content/uploads/ephy-webkit-graphic.png">
          <img class="img" id="ele3" draggable="true" @dragstart="dragElement"
            src="https://res.cloudinary.com/css-tricks/image/upload/w_600,q_auto,f_auto/buysellads/uu/7/112766/1646327381-MC_CSSTricks_Logo_600x600-_1_.png">
          <img class="img" id="ele4" draggable="true" @dragstart="dragElement"
            src="https://miro.medium.com/max/1400/1*9hd_8qR0CMZ8L0pVbFLjDw.png">
        </div>
        <br>
        <div id="canvas_cont" @dragover="allowDrop" @drop="dropElement">
          <canvas id="canvas" width="650" height="350"></canvas>
        </div>

      </div>

    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { fabric } from "fabric";
let canvas;
onMounted(() => {
  canvas = new fabric.Canvas('canvas');
  canvas.on('object:moving', function(options) {
  if (Math.round(options.target.left / grid * 1) % 1 == 0 &&
    Math.round(options.target.top / grid * 1) % 1 == 0) {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid
    }).setCoords();
  }
});
  let rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red'
  });

  canvas.add(rect);
})
const allowDrop = ((e) => {
  e.preventDefault();
})
const dragElement = ((e) => {
  e.dataTransfer.setData("id", e.target.id); //transfer the "data" i.e. id of the target dragged.
})
const dropElement = ((e) => {
  e.preventDefault();
  var data = e.dataTransfer.getData("id"); //receiving the "data" i.e. id of the target dropped.
  var imag = document.getElementById(data); //getting the target image info through its id. 
  var img = new fabric.Image(imag, { //initializing the fabric image.
    left: e.layerX - 80,  //positioning the target on exact position of mouse event drop through event.layerX,Y.
    top: e.layerY - 40,
  });
  img.scaleToWidth(imag.width); //scaling the image height and width with target height and width, scaleToWidth, scaleToHeight fabric inbuilt function. 
  img.scaleToHeight(imag.height);
  canvas.add(img);
})
</script>

<style scoped>
hr {
  margin-left: 15%;
  margin-right: 15%;
}

.img_cont {
  margin-left: 20%;
  margin-right: 20%;
  display: flex;
  justify-content: space-between;
}

.img {
  width: 150px;
  height: 100px;
}

#canvas_cont {
  align-items: center;
}

#canvas {
  border: 1px solid black;
  margin: 0;
}

.canvas-container {
  margin-left: 25%;
}

.draggable {
  display: inline-block;
  width: 150px;
  height: 150px;
  margin: 1rem;
  background-color: #29e;
  border-radius: 0.75rem;
  box-sizing: border-box;
  white-space: pre;
  touch-action: none;
  user-select: none;
}

.wrapper {
  border: 1pt solid red;
  height: 90vh;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.side-menu {
  border: 1pt solid blue;
  height: 100%;
  width: 30%;
  float: left;
}

.editor {
  border: 1pt solid green;
  height: 100%;
  width: 40%;
  float: right;
}
</style>
