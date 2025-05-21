router.post('/login', async (req,res)=>{
  const user = await User.findOne({name:req.body.name});
  if(!user || !await bcrypt.compare(req.body.pass,user.hash))
    return res.status(401).send('bad cred');
  const token = jwt.sign({uid:user._id}, process.env.JWT_SECRET,{expiresIn:'1d'});
  res.json({token});
});
