import Core from '../core';
import { Object3D, Raycaster, Vector2 } from 'three';
import {
  ON_CLICK_RAY_CAST,
  ON_HIDE_TOOLTIP,
  ON_SHOW_TOOLTIP,
} from '../Constants';

export default class RayCasterControls {
  private core: Core;
  private click_raycaster: Raycaster;
  private tooltip_raycaster: Raycaster;
  private hover_point: Vector2;
  private mouse_point: Vector2;
  private last_tooltip_check: number = 0;
  private tooltip_throttle: number = 100; // ms - chỉ check tooltip mỗi 100ms

  constructor() {
    this.core = new Core();

    this.click_raycaster = new Raycaster();
    // Click detection distance giảm xuống
    this.click_raycaster.far = 12;

    this.tooltip_raycaster = new Raycaster();
    // Tooltip chỉ hiện khi rất gần - giảm lag
    this.tooltip_raycaster.far = 8;

    this.hover_point = new Vector2(0, 0);
    this.mouse_point = new Vector2();
  }

  updateTooltipRayCast(raycast_objects: Object3D[] = []) {
    // Throttle tooltip check để giảm lag
    const now = Date.now();
    if (now - this.last_tooltip_check < this.tooltip_throttle) {
      return;
    }
    this.last_tooltip_check = now;

    if (raycast_objects.length) {
      this.tooltip_raycaster.setFromCamera(this.hover_point, this.core.camera);
      const intersects = this.tooltip_raycaster.intersectObjects(
        raycast_objects,
        true
      ); // true = check children meshes

      if (intersects.length && intersects[0].object.userData.title) {
        // Hiện title chuẩn như ban đầu
        this.core.$emit(ON_SHOW_TOOLTIP, {
          msg: intersects[0].object.userData.title,
          show_preview_tips: !!intersects[0].object.userData.show_boards,
        });
      } else {
        this.core.$emit(ON_HIDE_TOOLTIP);
      }
    }
  }

  bindClickRayCastObj(raycast_objects: Object3D[] = []) {
    let down_x = 0;
    let down_y = 0;

    document.body.addEventListener('pointerdown', (event) => {
      down_x = event.screenX;
      down_y = event.screenY;
    });

    document.body.addEventListener('pointerup', (event) => {
      const offset_x = Math.abs(event.screenX - down_x);
      const offset_y = Math.abs(event.screenY - down_y);

      // Click offset threshold
      if (
        offset_x <= 1 &&
        offset_y <= 1 &&
        event.target instanceof HTMLCanvasElement
      ) {
        this.mouse_point.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse_point.y = -((event.clientY / window.innerHeight) * 2 - 1);

        this.click_raycaster.setFromCamera(this.mouse_point, this.core.camera);
        const intersects =
          this.click_raycaster.intersectObjects(raycast_objects);
        if (intersects.length && intersects[0].object.userData.show_boards) {
          this.core.$emit(ON_CLICK_RAY_CAST, intersects[0].object);
        }
      }
    });
  }
}
