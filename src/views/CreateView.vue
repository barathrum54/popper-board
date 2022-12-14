<template>
  <div>
    <div class="wrapper">
      <div class="side-menu">
        <section>
          <h1 class="">Components</h1>
          <div class="component-list">
            <div class="component-item">
              <label for="input-component">Form Input</label>
              <input type="text" id="input-component" draggable="true" @dragstart="dragElement" readonly>
            </div>
            <div class="component-item">
              <label for="input-component">Title</label>
              <h1 type="text" id="title-component" draggable="true" @dragstart="dragElement">Title Element</h1>
            </div>
            <div class="component-item">
              <label for="button-component">Button</label>
              <button type="button" draggable="true" @dragstart="dragElement" id="button-component">BUTTON
                TITLE</button>
            </div>
            <div class="component-item">
              <label for="input-component">Graphic Asset</label>
              <img class="img" id="pop-image" draggable="true" @dragstart="dragElement" src="@/assets/stars.png">

            </div>
          </div>
        </section>

        <section>
          <div v-if="selectedObj" class="settings-list">
            <div class="settings-item bg-color" v-if="selectedObj == 'button' || selectedObj == 'circle'">
              <div>
                <label for="bg-color">Background Color</label>
                <input type="color" @change="changeTemplateBackgroundColor" v-model="backgroundColor" id="bg-color"
                  name="bg-color">
              </div>
              <small>Change the background color of popup base</small>
            </div>
          </div>
          <div v-if="selectedObj != 'button' && selectedObj != 'circle'" class="settings-empty">
            <h3>Please select an element</h3>
            <h4 class="muted">Drag and drop an element and click on it to select it</h4>
            <h4 class="muted">You can only edit background color of Popper base at this version</h4>
          </div>
        </section>
        <section class="general-buttons">
          <button class="finalize-btn" @click="finalize">Finalize and Save</button>
          <button class="reset-button" type="button" @click="resetTemplate">Reset</button>
        </section>

      </div>
      <div class="editor" ref="editor">
        <div id="canvas_cont" @dragover="allowDrop" @drop="dropElement">
          <canvas id="canvas"></canvas>
        </div>

      </div>

    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { onMounted, computed } from 'vue'
import { fabric } from "fabric";
import { savePopper } from '@/services/main.service'
import Swal from 'sweetalert2'
let canvas;
const editor = ref(null);
const backgroundColor = ref("#e07a5f");
const selectedObj = ref(null);
const onObjectSelected = (o) => {
  var objType = (canvas.getActiveObject().type ? canvas.getActiveObject().type : "");
  console.log(objType)
  selectedObj.value = objType;
  backgroundColor.value = canvas.getActiveObject().get("fill");
}
const onObjectDeselected = (o) => {
  console.log('object deselected')
  selectedObj.value = null;
}


onMounted(() => {


  canvas = new fabric.Canvas('canvas');
  canvas.setWidth(editor.value.clientWidth);
  canvas.setHeight(editor.value.clientHeight);
  initializeTemplate();
  canvas.on("selection:deselected", onObjectDeselected);
  canvas.on("selection:created", onObjectSelected);
  canvas.on("selection:updated", onObjectSelected);

  window.addEventListener('keydown', (e) => {
    if (e.key == 'Delete') {
      deleteObject();
    }
  });
})


const deleteObject = () => {
  canvas.getActiveObjects().forEach((obj) => {
    canvas.remove(obj)
  });
}
const finalize = (() => {
  let payload;
  Swal.fire({
    title: "It's time to save your Popper",
    showCancelButton: true,
    confirmButtonText: 'Let\'s do it!',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      let data = canvas.toJSON();
      console.log(data);
      return savePopper(data).then(res => {
        payload = res;
        console.log(res);
      }).catch(err => {
        Swal.showValidationMessage(
          `Request failed: ${err}`
        )
      })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(result)
      Swal.fire({
        title: `Saved!`,
        html: `
          Your Popper has been saved successfully!,
          <br>
          <a href="${payload.data.generated_url}" target="_blank">${payload.data.generated_url}</a> 
          <br>
          Import this to your web page and you are good to go!
        `,
        confirmButtonText: 'Cool!'
      })
    }
  })

})
const resetTemplate = (() => {
  canvas.clear();
  initializeTemplate();
})
const initializeTemplate = (() => {
  let circle = new fabric.Circle({
    left: 0,
    top: 0,
    radius: 250,
    fill: '#e07a5f',
    stroke: 'white',
    strokeWidth: 1,
  });
  let whiteStroke = new fabric.Circle({
    left: 0,
    top: 0,
    radius: 240,
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 3,
    selectable: false

  });
  // let text = new fabric.Text('Edit This Title', {
  //   left: 0,
  //   top: 0,
  //   fontSize: 40,
  //   fill: 'white',
  //   textAlign: 'center',
  //   fontFamily: 'Poppins'
  // });
  canvas.viewportCenterObject(circle)
  canvas.add(circle);
  canvas.add(whiteStroke);
  canvas.viewportCenterObject(whiteStroke)
  // canvas.add(text);
  // canvas.viewportCenterObject(text)

})
const allowDrop = ((e) => {
  e.preventDefault();
})
const dragElement = ((e) => {
  e.dataTransfer.setData("id", e.target.id); //transfer the "data" i.e. id of the target dragged.
})

const fabricDblClick = function (obj, handler) {
  return function () {
    if (obj.clicked) handler(obj);
    else {
      obj.clicked = true;
      setTimeout(function () {
        obj.clicked = false;
      }, 500);
    }
  };
};
var items;
var ungroup = function (group) {
  items = group._objects;
  group._restoreObjectsState();
  canvas.remove(group);
  canvas.renderAll();
  for (var i = 0; i < items.length; i++) {
    canvas.add(items[i]);
  }
  // if you have disabled render on addition
  canvas.renderAll();
};
// Re-group when text editing finishes



const dropElement = ((e) => {
  console.log(e.dataTransfer.getData('id'));
  e.preventDefault();
  var data = e.dataTransfer.getData("id"); //receiving the "data" i.e. id of the target dropped.
  if (data == "button-component") {

    let button = new fabric.Rect({
      width: 160,
      height: 40,
      fill: '#414142',
      rx: 10,
      ry: 10,
      strokeWidth: 1
    });
    let buttonText = new fabric.Textbox('Button Title', {
      width: 160,
      height: 40,
      fontSize: 18,
      fontWeight: 'bolder',
      fill: 'white',
      textAlign: 'center',
      fontFamily: 'Poppins',
      originX: 'center', originY: 'center',
      left: 80, top: 20,
    });
    buttonText.on('editing:exited', function () {
      for (var i = 0; i < items.length; i++) {
        canvas.remove(items[i]);
      }
      var grp = new fabric.Group(items, {
        type: 'button',
        originX: 'center',
        originY: 'center',
      });
      canvas.add(grp);
      grp.on('mousedown', fabricDblClick(grp, function (obj) {
        ungroup(grp);
        canvas.setActiveObject(buttonText);
        buttonText.enterEditing();
        buttonText.selectAll();
      }));
    });
    let btnGroup = new fabric.Group([button, buttonText], {
      type: 'button',
      originX: 'center',
      originY: 'center',
    });
    btnGroup.on('mousedown', fabricDblClick(btnGroup, function (obj) {
      ungroup(btnGroup);
      canvas.setActiveObject(buttonText);
      buttonText.enterEditing();
      buttonText.selectAll();
      canvas.renderAll();
    }));
    canvas.add(btnGroup);
    canvas.viewportCenterObject(btnGroup)

    return;
  }
  if (data == "input-component") {
    let inputElement = new fabric.Rect({
      width: 335,
      height: 50,
      fill: '#fff',
      rx: 10,
      ry: 10,
      strokeWidth: 1
    });
    let placeholderText = new fabric.Textbox('E-mail', {
      height: 50,
      width: 0,
      fontSize: 20,
      fill: 'grey',
      textAlign: 'center',
      fontFamily: 'Poppins',
      left: 15, top: 13,

    });
    placeholderText.on('editing:exited', function () {
      for (var i = 0; i < items.length; i++) {
        canvas.remove(items[i]);
      }
      var grp = new fabric.Group(items, {
        type: 'input',
        originX: 'center',
        originY: 'center',
      });
      canvas.add(grp);
      grp.on('mousedown', fabricDblClick(grp, function (obj) {
        ungroup(grp);
        canvas.setActiveObject(buttonText);
        buttonText.enterEditing();
        buttonText.selectAll();
      }));
    });
    let inputGroup = new fabric.Group([inputElement, placeholderText], {
      type: 'input',
      originX: 'center',
      originY: 'center',
    });
    inputGroup.on('mousedown', fabricDblClick(placeholderText, function (obj) {
      ungroup(inputGroup);
      canvas.setActiveObject(placeholderText);
      placeholderText.enterEditing();
      placeholderText.selectAll();
      canvas.renderAll();
    }));
    canvas.add(inputGroup);
    canvas.viewportCenterObject(inputGroup)

    return;
  }
  if (data == "title-component") {
    var input = new fabric.Textbox('Edit this Text', {
      width: 200,
      fontSize: 40,
      fill: 'white',
      textAlign: 'center',
      fontFamily: 'Poppins'
    });
    canvas.add(input);
    canvas.viewportCenterObject(input)

    return;
  }
  if (data == "pop-image") {
    var img = new fabric.Image(document.getElementById('pop-image'), {
    });
    img.scaleToWidth(50);
    img.scaleToHeight(50);

    canvas.add(img);
    canvas.viewportCenterObject(img)

    return;
  }
})
const changeTemplateBackgroundColor = ((e) => {
  console.log(backgroundColor.value);
  canvas.getActiveObject().set('fill', backgroundColor.value);
  canvas.renderAll();
})
</script>

<style scoped>
.component-list {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 0px;
}

.component-item {
  padding: 5px 0px;
  display: flex;
  cursor: pointer;
  flex-flow: column;
}

#input-component {
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
  padding: 5px;
  width: 300px;
  height: 40px;
  border-radius: 15px;
}

#title-component {
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
  padding: 5px;
  width: 300px;
  height: 40px;
  border-radius: 5px;
}

#button-component {
  cursor: pointer;
  border: none;
  padding: 5px;
  background-color: #414142;
  outline: none;
  width: 300px;
  height: 65px;
  border-radius: 15px;
  color: white;
  text-align: center;
  font-size: 30px;
  font-family: Poppins;
  font-weight: bolder;
  transition: .2s all ease;
}

#button-component:hover {
  background-color: #626262;
}

canvas {
  border: none !important;
}

#canvas_cont {
  margin: 0;
  height: 100%;
  width: 100%;
  position: relative;
  border: 2px dashed orange !important;

}

.canvas-container {
  text-align: center;
}

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
  object-fit: contain;
  width: 150px;
  height: 100px;
}



canvas {
  border: 1px solid black;
  margin: 0;
  height: 100%;
  width: 100%;
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
  height: 90vh;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.side-menu {
  border: 1pt solid #000;
  border-radius: 15px;
  height: 800px;
  width: 800px;
  float: left;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.editor {
  border: 1pt solid green;
  height: 800px;
  width: 800px;
  float: right;
}

.muted {
  opacity: 0.7;
}

label {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.finalize-btn {
  background-color: #29e;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s all ease;
}

.reset-button {
  background-color: rgb(238, 34, 34);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s all ease;
  margin-left: 10px;
}

.general-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

.bg-color {
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.bg-color label {
  margin-right: 10px;
}
</style>
