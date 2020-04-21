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
 * This class is used as a wrapper for Google Assistant Canvas Action class
 * along with its callbacks.
 */
export class Action {
  /**
   * @param {*} scene which serves as a container of all visual elements
   */
  constructor(scene) {
    this.canvas = window.interactiveCanvas;
    this.scene = scene;
    this.commands = {
      TINT: (data) => {
        this.scene.sprite.tint = data.tint;
      },
      SPIN: (data) => {
        this.scene.sprite.spin = data.spin;
      },
      RESTART_GAME: (data) => {
        this.scene.button.texture = this.scene.button.textureButton;
        this.scene.sprite.spin = true;
        this.scene.sprite.tint = 0x00FF00; // green
        this.scene.sprite.rotation = 0;
      },
    };
    this.commands.TINT.bind(this);
    this.commands.SPIN.bind(this);
    this.commands.RESTART_GAME.bind(this);
  }

  /**
   * Register all callbacks used by Interactive Canvas
   * executed during scene creation time.
   *
   */
  setCallbacks() {
    // declare interactive canvas callbacks
    const callbacks = {
      onUpdate: (data) => {
        try {
          this.commands[data[0].command.toUpperCase()](data[0]);
        } catch (e) {
          // do nothing, when no command is sent or found
        }
      },
    };
    callbacks.onUpdate.bind(this);
    // called by the Interactive Canvas web app once web app has loaded to
    // register callbacks
    this.canvas.ready(callbacks);
  }
}
