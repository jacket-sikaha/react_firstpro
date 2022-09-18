import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Table,
  Tag,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import "./index.scss";
import img404 from "@/assets/404.png";
import { http } from "@/utils";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (data) => <Tag color="green">审核通过</Tag>,
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                goPublish(data);
              }}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                delArticle(data);
              }}
            />
          </Space>
        );
      },
    },
  ];

  // const data = [
  //   {
  //     id: "8218",
  //     comment_count: 0,
  //     cover: {
  //       images: ["http://geek.itheima.net/resources/images/15.jpg"],
  //     },
  //     like_count: 0,
  //     pubdate: "2019-03-11 09:00:00",
  //     read_count: 2,
  //     status: 2,
  //     title: "wkwebview离线化加载h5资源解决方案",
  //   },
  // ];

  // const [channelList, setChannelList] = useState([]);
  //useState和useEffect的拆分粒度问题
  //useState  一些数据之间逻辑关系密切的就可以归在一类统一管理，反之就要拆开管理
  //useEffect 根据事务的执行时机与频率去使用useEffect，如一些静态数据只需要渲染一次的就可以统一处理
  //反之  不同依赖项的状态变化各自触发不同的事务则需要拆开管理

  const { channelStore } = useStore();
  useEffect(() => {
    channelStore.loadChannelList();
  }, [channelStore]);

  //文章列表管理  统一管理数据  将来修改给setList传对象
  const [articleData, setList] = useState({
    list: [], //文章列表
    count: 0, //文章数量
  });

  //文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
  });

  //如果异步请求函数需要依赖一些数据的变化而重新执行
  //推荐把他写到内部
  //统一不抽离函数到外面  只要涉及到异步请求的函数  都放到useEffect内部
  //本质区别：写到外面每次组件更新都会重新进行函数初始化  这本身就是一次性能消耗
  //而写到useEffect内部 只会在依赖项发生变化的时候  函数才会进行重新初始化
  //避免性能损失------就是那种需要频繁修改数据渲染的状态对象，写成闭包用空间换时间

  useEffect(() => {
    const loadList = async () => {
      const res = await http.get("/mp/articles", { params });
      const { results, total_count } = res.data.data;
      setList({ list: results, count: total_count });
    };
    loadList();
  }, [params]);

  const onFinish = (values) => {
    console.log("Success:", values);
    const { status, channel_id, date } = values;
    // 格式化表单数据
    const _params = {};
    // 格式化status
    _params.status = status;
    if (channel_id) {
      _params.channel_id = channel_id;
    }
    if (date) {
      _params.begin_pubdate = date[0].format("YYYY-MM-DD");
      _params.end_pubdate = date[1].format("YYYY-MM-DD");
    }
    // 修改params参数 触发接口再次发起
    // 对象合并 hook这么写
    //setParams(_params);
    //是会直接改了对象的整体引用，而类组件则会自动合并
    //两种写法 复制一份引用再重新修改调用 / 传入一个回调函数
    // setParams({
    //   ...params,
    //   ..._params,
    // });
    setParams((a) => {
      return { ...a, ..._params };
    });
  };

  //页数跳转
  const pageChange = (page, pageSize) => {
    console.log("page", page);

    console.log("pageSize", pageSize);
    setParams({ page, per_page: pageSize });
  };

  //删除文章
  const delArticle = async (data) => {
    console.log("data", data);
    await http.delete(`/mp/articles/${data.id}`);
    //引起渲染，页面更新
    setParams({
      page: 1,
      ...params,
    });
  };

  const navigate = useNavigate(); //这个hook不能写在某个函数内
  //跳转编辑文章
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`);
  };
  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: -1 }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select placeholder="请选择文章频道" style={{ width: 120 }}>
              {channelStore.channelList.map((value) => (
                <Option key={value.id} value={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagination={{
            pageSize: params.per_page,
            total: articleData.count,
            onChange: pageChange,
          }}
        />
      </Card>
    </div>
  );
};

export default Article;
