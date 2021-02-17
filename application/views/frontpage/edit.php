<!-- Page Header -->
<header class="masthead" style="background-image: url('http://localhost/blog/img/contact-bg.jpg')">
    <div class="overlay"></div>
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-md-10 mx-auto">
                <div class="page-heading">
                    <h1>Edit your post</h1>
                    <span class="subheading">Sometimes mistake is a mistake.</span>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- Main Content -->
<div class="container">
    <div class="row">
        <?php foreach ($story as $data) : ?>
            <div class="col-lg-8 col-md-10 mx-auto">
                <p></p>
                <form name="sentMessage" id="contactForm" action="<?= base_url() ?>Welcome/EditPost/<?= $data['id_story'] ?>" method="POST" novalidate>
                    <div class="control-group">
                        <div class="form-group floating-label-form-group controls">
                            <label>Title</label>
                            <input value="<?= $data['title'] ?>" name="title" type="text" class="form-control" placeholder="title" id="name" required data-validation-required-message="Please put your title.">
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="form-group floating-label-form-group controls">
                            <label>Story</label>
                            <textarea  name="story" rows="5" class="form-control" placeholder="Story" id="message" required data-validation-required-message="Please enter your story."><?= $data['story'] ?></textarea>
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="form-group col-xs-12 floating-label-form-group controls">
                            <label>Username</label>
                            <input value="<?= $data['username'] ?>" name="username" type="text" class="form-control" placeholder="Username" id="phone" required data-validation-required-message="Please enter your phone number.">
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="form-group floating-label-form-group controls">
                            <label>Password</label>
                            <input name="password" type="password" class="form-control" placeholder="Password" id="email" required data-validation-required-message="Please enter your password.">
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <br>
                    <div id="success"></div>
                    <button type="submit" class="btn btn-primary" id="sendMessageButton">Send</button>
                </form>
            </div>
        <?php endforeach ?>
    </div>
</div>

<hr>