/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represent Triangle scene
 */
export class Scene {
  /**
   * Initializes the game with visual components.
   */
  constructor() {
    const view = document.getElementById('view');

    // set up fps monitoring
    const stats = new Stats();
    view.getElementsByClassName('stats')[0].appendChild(stats.domElement);

    // initialize rendering and set correct sizing
    this.ratio = window.devicePixelRatio;
    this.renderer = PIXI.autoDetectRenderer({
      transparent: true,
      antialias: true,
      resolution: this.ratio,
      width: view.clientWidth,
      height: view.clientHeight,
    });
    this.element = this.renderer.view;
    this.element.style.width = `${this.renderer.width / this.ratio}px`;
    this.element.style.height = `${this.renderer.height / this.ratio}px`;
    view.appendChild(this.element);

    // center stage and normalize scaling for all resolutions
    this.stage = new PIXI.Container();
    this.stage.position.set(view.clientWidth / 2, view.clientHeight / 2);
    this.stage.scale.set(Math.max(this.renderer.width,
        this.renderer.height) / 1024);

    // load a sprite from a svg file
    this.sprite = PIXI.Sprite.from('triangle.svg');
    this.sprite.anchor.set(0.5);
    this.sprite.tint = 0x00FF00; // green
    this.sprite.spin = true;
    this.stage.addChild(this.sprite);

    // toggle spin on touch events of the triangle
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.on('pointerdown', () => {
      this.sprite.spin = !this.sprite.spin;
    });

    let last = performance.now();
    // frame-by-frame animation function
    const frame = () => {
      stats.begin();

      // calculate time differences for smooth animations
      const now = performance.now();
      const delta = now - last;

      // rotate the triangle only if spin is true
      if (this.sprite.spin) {
        this.sprite.rotation += delta / 1000;
      }

      last = now;

      this.renderer.render(this.stage);
      stats.end();
      requestAnimationFrame(frame);
    };
    frame();
    this.handleRestartGame = this.handleRestartGame.bind(this);
    this.createRestartGameButton();
  }

  /**
   * Restart game button to showcase sendTextQuery.
   */
  createRestartGameButton() {
    const textureButton = PIXI.Texture
        .fromImage('./restart_game_btn_enabled.png');
    this.button = new PIXI.Sprite(textureButton);
    this.button.scale.set(0.5);
    this.button.textureButton = textureButton;
    this.button.textureButtonDisabled = PIXI.Texture
        .fromImage('./restart_game_btn_disabled.png');

    this.button.buttonMode = true;
    this.button.anchor.set(0.5);
    this.button.x = 0;
    this.button.y = 100;
    this.button.interactive = true;
    this.button.buttonMode = true;
    this.button.on('pointerdown', this.handleRestartGame);
    this.stage.addChild(this.button);
  }

  /**
   * Handle game restarts
   */
  async handleRestartGame() {
    console.log(`Request in flight`);
    this.button.texture = this.button.textureButtonDisabled;
    this.sprite.spin = false;
    const res = await this.action.canvas.sendTextQuery('Restart game');

    if (res.toUpperCase() !== 'SUCCESS') {
      console.log(`Request in flight: ${res}`);
      return;
    }

    console.log(`Request in flight: ${res}`);
    this.button.texture = this.button.textureButtonDisabled;
    this.sprite.spin = false;
  }
}
