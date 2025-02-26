import React from "react";
import "./categories.css";

export const Categories = () => {
  return (
    <section class="ezy__epcategory10 dark-gray">
      <div class="container position-relative">
        <div class="row justify-content-center">
          <div class="col-12 mt-5">
            <div
              id="ezy__epcategory10-controls"
              class="carousel slide position-relative"
              data-ride="carousel"
            >
              <div class="carousel-inner position-relative overflow-visible">
                <div class="carousel-item active">
                  <div class="row">
                    <div class="col-12 col-md-6 col-lg-3 my-5">
                      <a href="#!" class="ezy__epcategory10-item rounded-pill">
                        <div class="ezy__epcategory10-img">
                          <img src="./ad.png" alt="" />
                        </div>
                        <h4 class="mb-4 fw-bold">AD Earrings</h4>
                      </a>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3 my-5">
                      <a href="#!" class="ezy__epcategory10-item rounded-pill">
                        <div class="ezy__epcategory10-img">
                          <img src="./di.png" alt="" />
                        </div>
                        <h4 class="mb-4 fw-bold">Diamond Earrings</h4>
                      </a>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3 my-5">
                      <a href="#!" class="ezy__epcategory10-item rounded-pill">
                        <div class="ezy__epcategory10-img">
                          <img src="./go.png" alt="" />
                        </div>
                        <h4 class="mb-4 fw-bold">Gold Earrings</h4>
                      </a>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3 my-5">
                      <a href="#!" class="ezy__epcategory10-item rounded-pill">
                        <div class="ezy__epcategory10-img">
                          <img src="./in.png" alt="" />
                        </div>
                        <h4 class="mb-4 fw-bold">Indian Earrings</h4>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="carousel-control-prev ezy__epcategory10-arrow-left"
                type="button"
                data-bs-target="#ezy__epcategory10-controls"
                data-bs-slide="prev"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                class="carousel-control-next ezy__epcategory10-arrow-right"
                type="button"
                data-bs-target="#ezy__epcategory10-controls"
                data-bs-slide="next"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
