<!-- Page Header -->
<header class="masthead" style="background-image: url('http://localhost/blog/img/home-bg.jpg')">
  <div class="overlay"></div>
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-md-10 mx-auto">
        <div class="site-heading">
          <h1>Social Blog Site</h1>
          <span class="subheading">Hey stranger nice to meet you.</span>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- Main Content -->
<div class="container">
  <div class="row">
    <form class="d-flex" action="" method="POST">
      <input name="search" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
      <button name="submit" class="btn btn-outline-secondary" type="submit">Search</button>
    </form>
    <div class="col-lg-8 col-md-10 mx-auto">
      <?php if (isset($stories)) : ?>
        <?php foreach ($stories as $data) : ?>
          <div class="post-preview">
            <a href="post.html">
              <h2 class="post-title">
                <?= $data['title'] ?>
              </h2>
              <h3 class="post-subtitle">
                <?= $data['story'] ?>
              </h3>
            </a>
            <p class="post-meta">Posted by
              <a><?= $data['username'] ?></a>
            </p>
              <p class="post-meta">
                <a type="button" class="btn btn-primary" href=''>Open</a>
            <?php if ($this->session->has_userdata('username')) { ?>
                <a type="button" class="btn btn-success" href='<?= base_url() ?>Welcome/EditStory/<?= $data['id_story'] ?>'>Edit</a>
                <a type="button" class="btn btn-danger" href='<?= base_url() ?>Welcome/DeletePost/<?= $data['id_story'] ?>'>Delete</a>
              </p>
            <?php } ?>
          </div>
          <hr>
        <?php endforeach ?>
      <?php endif ?>
    </div>
    <div class="clearfix">
      <div class="col">
        <a><?= $this->pagination->create_links(); ?></a>
      </div>
    </div>
  </div>
</div>
<hr>