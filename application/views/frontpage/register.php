<!-- Page Header -->
<header class="masthead" style="background-image: url('http://localhost/blog/img/contact-bg.jpg')">
    <div class="overlay"></div>
    <div class="container">
        <div class="row">
            <?php if ('Email' === $this->uri->segment(3)) {
            ?>
                <div class="col-lg-8 col-md-10 mx-auto">
                    <div class="page-heading">
                        <h1>Something Wrong</h1>
                        <span class="subheading">Your email has been used</span>
                    </div>
                </div>
            <?php
            } else if ('Wrong' === $this->uri->segment(3)) {
            ?>
                <div class="col-lg-8 col-md-10 mx-auto">
                    <div class="page-heading">
                        <h1>Something Wrong</h1>
                        <span class="subheading">Check your password</span>
                    </div>
                </div>
            <?php
            } else if (null === $this->uri->segment(3)) {
            ?>
                <div class="col-lg-8 col-md-10 mx-auto">
                    <div class="page-heading">
                        <h1>Join Us</h1>
                        <span class="subheading">We will make sure there is no problem</span>
                    </div>
                </div>
            <?php
            } ?>
        </div>
    </div>
</header>

<!-- Main Content -->
<div class="container">
    <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
            <p></p>
            <form action="<?= base_url() ?>Welcome/SendUser" method="POST" class="needs-validation" novalidate>
                <div class="form-row">
                    <div class="col-md-4 mb-3">
                        <label for="validationCustomUsername">Username</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroupPrepend">@</span>
                            </div>
                            <input name="username" type="text" class="form-control" id="username" placeholder="" aria-describedby="inputGroupPrepend" required>
                            <div class="invalid-feedback">
                                Please choose a username.
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8 mb-3">
                        <label for="validationCustom01">Email</label>
                        <input name="email" type="email" class="form-control" id="email" placeholder="" required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                        <div class="invalid-feedback">
                            Please use valid email.
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-6 mb-3">
                        <label for="validationCustom03">Password</label>
                        <input name="password" type="password" class="form-control" id="password" placeholder="" required>
                        <div class="invalid-feedback">
                            Please provide a Password.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="validationCustom04">Password-Retype</label>
                        <input name="passwordRe" type="password" class="form-control" id="passwordRe" placeholder="" required>
                        <div class="invalid-feedback">
                            Please write your password again.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
                        <label class="form-check-label" for="invalidCheck">
                            Agree to terms and conditions
                        </label>
                        <div class="invalid-feedback">
                            You must agree before submitting.
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" type="submit">Submit form</button>
            </form>

            <script>
                // Example starter JavaScript for disabling form submissions if there are invalid fields
                (function() {
                    'use strict';
                    window.addEventListener('load', function() {
                        // Fetch all the forms we want to apply custom Bootstrap validation styles to
                        var forms = document.getElementsByClassName('needs-validation');
                        // Loop over them and prevent submission
                        var validation = Array.prototype.filter.call(forms, function(form) {
                            form.addEventListener('submit', function(event) {
                                if (form.checkValidity() === false) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                                form.classList.add('was-validated');
                            }, false);
                        });
                    }, false);
                })();
            </script>
        </div>
    </div>
</div>
<hr>